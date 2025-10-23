"""
Parallel Processing Module for Evidence Collection and Analysis
Provides efficient parallel processing capabilities for the legal attention system
"""

import asyncio
import concurrent.futures
import multiprocessing
from typing import List, Dict, Any, Callable, Optional, Tuple
from dataclasses import dataclass
import time
import threading
from queue import Queue, Empty
import json
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class TaskResult:
    """Result of a parallel task"""
    task_id: str
    success: bool
    result: Any
    error: Optional[str] = None
    execution_time: float = 0.0
    worker_id: Optional[str] = None

class ParallelProcessor:
    """High-performance parallel processor for evidence collection"""
    
    def __init__(self, max_workers: Optional[int] = None):
        self.max_workers = max_workers or min(32, (multiprocessing.cpu_count() or 1) + 4)
        self.thread_pool = concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers)
        self.process_pool = concurrent.futures.ProcessPoolExecutor(max_workers=self.max_workers)
        self.task_queue = Queue()
        self.results = {}
        self.active_tasks = {}
        self._shutdown = False
        self._worker_threads = []
        self._start_workers()
    
    def _start_workers(self):
        """Start worker threads for task processing"""
        for i in range(self.max_workers):
            worker = threading.Thread(target=self._worker_loop, daemon=True)
            worker.start()
            self._worker_threads.append(worker)
    
    def _worker_loop(self):
        """Worker thread main loop"""
        while not self._shutdown:
            try:
                task = self.task_queue.get(timeout=1.0)
                if task is None:  # Shutdown signal
                    break
                
                self._process_task(task)
                self.task_queue.task_done()
            except Empty:
                continue
            except Exception as e:
                logger.error(f"Worker error: {e}")
    
    def _process_task(self, task: Dict[str, Any]):
        """Process a single task"""
        task_id = task['id']
        func = task['func']
        args = task.get('args', ())
        kwargs = task.get('kwargs', {})
        
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            
            self.results[task_id] = TaskResult(
                task_id=task_id,
                success=True,
                result=result,
                execution_time=execution_time,
                worker_id=threading.current_thread().name
            )
        except Exception as e:
            execution_time = time.time() - start_time
            self.results[task_id] = TaskResult(
                task_id=task_id,
                success=False,
                result=None,
                error=str(e),
                execution_time=execution_time,
                worker_id=threading.current_thread().name
            )
            logger.error(f"Task {task_id} failed: {e}")
    
    def submit_task(self, task_id: str, func: Callable, *args, **kwargs) -> str:
        """Submit a task for parallel processing"""
        task = {
            'id': task_id,
            'func': func,
            'args': args,
            'kwargs': kwargs
        }
        
        self.task_queue.put(task)
        self.active_tasks[task_id] = task
        return task_id
    
    def get_result(self, task_id: str, timeout: Optional[float] = None) -> Optional[TaskResult]:
        """Get result of a task"""
        start_time = time.time()
        while task_id not in self.results:
            if timeout and (time.time() - start_time) > timeout:
                return None
            time.sleep(0.01)
        
        result = self.results.pop(task_id, None)
        if result and task_id in self.active_tasks:
            del self.active_tasks[task_id]
        return result
    
    def wait_for_all(self, timeout: Optional[float] = None) -> List[TaskResult]:
        """Wait for all tasks to complete"""
        start_time = time.time()
        results = []
        
        while self.active_tasks:
            if timeout and (time.time() - start_time) > timeout:
                logger.warning(f"Timeout waiting for {len(self.active_tasks)} tasks")
                break
            
            # Collect completed results
            completed_tasks = []
            for task_id in list(self.active_tasks.keys()):
                if task_id in self.results:
                    result = self.results.pop(task_id)
                    results.append(result)
                    completed_tasks.append(task_id)
            
            # Remove completed tasks
            for task_id in completed_tasks:
                del self.active_tasks[task_id]
            
            time.sleep(0.01)
        
        return results
    
    def shutdown(self):
        """Shutdown the parallel processor"""
        self._shutdown = True
        
        # Send shutdown signals to workers
        for _ in self._worker_threads:
            self.task_queue.put(None)
        
        # Wait for workers to finish
        for worker in self._worker_threads:
            worker.join(timeout=5.0)
        
        # Shutdown thread pools
        self.thread_pool.shutdown(wait=True)
        self.process_pool.shutdown(wait=True)

class AsyncEvidenceCollector:
    """Asynchronous evidence collection system"""
    
    def __init__(self, max_concurrent: int = 10):
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.results = {}
    
    async def collect_evidence_async(self, evidence_items: List[Dict[str, Any]]) -> List[TaskResult]:
        """Collect evidence asynchronously"""
        tasks = []
        
        for item in evidence_items:
            task = asyncio.create_task(
                self._collect_single_evidence(item)
            )
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Convert results to TaskResult objects
        task_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                task_results.append(TaskResult(
                    task_id=evidence_items[i].get('id', f'task_{i}'),
                    success=False,
                    result=None,
                    error=str(result)
                ))
            else:
                task_results.append(TaskResult(
                    task_id=evidence_items[i].get('id', f'task_{i}'),
                    success=True,
                    result=result
                ))
        
        return task_results
    
    async def _collect_single_evidence(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Collect a single evidence item"""
        async with self.semaphore:
            # Simulate evidence collection work
            await asyncio.sleep(0.1)  # Simulate I/O delay
            
            # Process evidence item
            result = {
                'id': item.get('id'),
                'status': 'collected',
                'timestamp': time.time(),
                'data': item.get('data', {})
            }
            
            return result

class EvidenceBatchProcessor:
    """Batch processor for evidence collection and analysis"""
    
    def __init__(self, batch_size: int = 100):
        self.batch_size = batch_size
        self.processor = ParallelProcessor()
        self.async_collector = AsyncEvidenceCollector()
    
    def process_evidence_batch(self, evidence_items: List[Dict[str, Any]]) -> List[TaskResult]:
        """Process a batch of evidence items"""
        # Split into batches
        batches = [
            evidence_items[i:i + self.batch_size]
            for i in range(0, len(evidence_items), self.batch_size)
        ]
        
        # Process each batch in parallel
        batch_tasks = []
        for i, batch in enumerate(batches):
            task_id = f"batch_{i}"
            self.processor.submit_task(
                task_id,
                self._process_single_batch,
                batch
            )
            batch_tasks.append(task_id)
        
        # Wait for all batches to complete
        results = self.processor.wait_for_all()
        return results
    
    def _process_single_batch(self, batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process a single batch of evidence items"""
        results = []
        
        for item in batch:
            try:
                # Simulate evidence processing
                result = {
                    'id': item.get('id'),
                    'processed': True,
                    'timestamp': time.time(),
                    'data': item.get('data', {})
                }
                results.append(result)
            except Exception as e:
                logger.error(f"Error processing item {item.get('id')}: {e}")
                results.append({
                    'id': item.get('id'),
                    'processed': False,
                    'error': str(e)
                })
        
        return results
    
    async def process_evidence_async(self, evidence_items: List[Dict[str, Any]]) -> List[TaskResult]:
        """Process evidence items asynchronously"""
        return await self.async_collector.collect_evidence_async(evidence_items)
    
    def shutdown(self):
        """Shutdown the batch processor"""
        self.processor.shutdown()

class HypergraphParallelAnalyzer:
    """Parallel analyzer for hypergraph data"""
    
    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
        self.processor = ParallelProcessor(max_workers)
    
    def analyze_paragraphs_parallel(self, paragraphs: List[Dict[str, Any]]) -> List[TaskResult]:
        """Analyze paragraphs in parallel"""
        tasks = []
        
        for i, paragraph in enumerate(paragraphs):
            task_id = f"paragraph_analysis_{i}"
            self.processor.submit_task(
                task_id,
                self._analyze_single_paragraph,
                paragraph
            )
            tasks.append(task_id)
        
        return self.processor.wait_for_all()
    
    def _analyze_single_paragraph(self, paragraph: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a single paragraph"""
        # Simulate analysis work
        time.sleep(0.01)  # Simulate processing time
        
        analysis = {
            'id': paragraph.get('id'),
            'priority_score': hash(paragraph.get('id', '')) % 100,
            'evidence_count': len(paragraph.get('properties', {}).get('evidence_references', [])),
            'completion_status': 'analyzed',
            'timestamp': time.time()
        }
        
        return analysis
    
    def analyze_evidence_coverage_parallel(self, evidence_data: List[Dict[str, Any]]) -> List[TaskResult]:
        """Analyze evidence coverage in parallel"""
        tasks = []
        
        for i, evidence in enumerate(evidence_data):
            task_id = f"evidence_coverage_{i}"
            self.processor.submit_task(
                task_id,
                self._analyze_evidence_coverage,
                evidence
            )
            tasks.append(task_id)
        
        return self.processor.wait_for_all()
    
    def _analyze_evidence_coverage(self, evidence: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze evidence coverage for a single item"""
        # Simulate coverage analysis
        time.sleep(0.005)  # Simulate processing time
        
        coverage = {
            'id': evidence.get('id'),
            'coverage_score': hash(evidence.get('id', '')) % 100,
            'completeness': 'partial' if hash(evidence.get('id', '')) % 2 else 'complete',
            'timestamp': time.time()
        }
        
        return coverage
    
    def shutdown(self):
        """Shutdown the parallel analyzer"""
        self.processor.shutdown()

# Global instances
parallel_processor = ParallelProcessor()
evidence_batch_processor = EvidenceBatchProcessor()
hypergraph_analyzer = HypergraphParallelAnalyzer()

# Convenience functions
def process_evidence_parallel(evidence_items: List[Dict[str, Any]]) -> List[TaskResult]:
    """Process evidence items in parallel"""
    return evidence_batch_processor.process_evidence_batch(evidence_items)

async def process_evidence_async(evidence_items: List[Dict[str, Any]]) -> List[TaskResult]:
    """Process evidence items asynchronously"""
    return await evidence_batch_processor.process_evidence_async(evidence_items)

def analyze_hypergraph_parallel(paragraphs: List[Dict[str, Any]]) -> List[TaskResult]:
    """Analyze hypergraph data in parallel"""
    return hypergraph_analyzer.analyze_paragraphs_parallel(paragraphs)

# Example usage and testing
if __name__ == "__main__":
    print("🚀 Parallel Processing System")
    print("=" * 50)
    
    # Test parallel evidence processing
    print("Testing parallel evidence processing...")
    
    # Create sample evidence items
    evidence_items = [
        {'id': f'evidence_{i}', 'data': {'type': 'document', 'priority': i % 3 + 1}}
        for i in range(20)
    ]
    
    # Process evidence in parallel
    start_time = time.time()
    results = process_evidence_parallel(evidence_items)
    end_time = time.time()
    
    print(f"Processed {len(results)} evidence items in {end_time - start_time:.2f} seconds")
    
    # Count successful results
    successful = sum(1 for r in results if r.success)
    print(f"Successful: {successful}/{len(results)}")
    
    # Test async processing
    print("\nTesting async evidence processing...")
    
    async def test_async():
        start_time = time.time()
        results = await process_evidence_async(evidence_items[:10])
        end_time = time.time()
        
        print(f"Async processed {len(results)} items in {end_time - start_time:.2f} seconds")
        return results
    
    # Run async test
    asyncio.run(test_async())
    
    # Test hypergraph analysis
    print("\nTesting parallel hypergraph analysis...")
    
    paragraphs = [
        {'id': f'para_{i}', 'properties': {'evidence_references': [f'ev_{j}' for j in range(i % 5)]}}
        for i in range(15)
    ]
    
    start_time = time.time()
    analysis_results = analyze_hypergraph_parallel(paragraphs)
    end_time = time.time()
    
    print(f"Analyzed {len(analysis_results)} paragraphs in {end_time - start_time:.2f} seconds")
    
    # Show performance summary
    print(f"\n📊 Performance Summary:")
    print(f"CPU cores available: {multiprocessing.cpu_count()}")
    print(f"Max workers: {parallel_processor.max_workers}")
    print(f"Active tasks: {len(parallel_processor.active_tasks)}")
    
    # Shutdown
    parallel_processor.shutdown()
    evidence_batch_processor.shutdown()
    hypergraph_analyzer.shutdown()
    
    print("\n✅ Parallel processing system ready!")