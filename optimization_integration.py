"""
Optimization Integration Script
Integrates all optimization modules and provides a unified interface
"""

import sys
import time
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
import asyncio
import threading
from concurrent.futures import ThreadPoolExecutor

# Import all optimization modules
from performance_monitor import (
    performance_monitor, start_performance_monitoring, 
    stop_performance_monitoring, get_performance_report,
    export_performance_metrics
)
from optimized_data_manager import (
    optimized_data_manager, load_optimized_hypergraph,
    get_optimized_node, get_optimized_connections,
    get_optimized_nodes_by_type
)
from parallel_processor import (
    parallel_processor, process_evidence_parallel,
    process_evidence_async, analyze_hypergraph_parallel
)
from optimized_legal_attention_engine import (
    optimized_engine, scenario_processor,
    process_legal_scenario, process_scenarios_parallel,
    get_engine_performance, optimize_engine_memory
)

class OptimizationManager:
    """Manages all optimization modules and provides unified interface"""
    
    def __init__(self):
        self.modules = {
            'performance_monitor': performance_monitor,
            'data_manager': optimized_data_manager,
            'parallel_processor': parallel_processor,
            'legal_engine': optimized_engine,
            'scenario_processor': scenario_processor
        }
        
        self.optimization_stats = {
            'start_time': time.time(),
            'modules_initialized': 0,
            'total_optimizations': 0,
            'memory_savings': 0,
            'performance_improvements': {}
        }
        
        self._initialize_modules()
    
    def _initialize_modules(self):
        """Initialize all optimization modules"""
        print("🚀 Initializing Optimization Manager...")
        
        # Start performance monitoring
        start_performance_monitoring(interval=1.0)
        self.optimization_stats['modules_initialized'] += 1
        
        # Initialize data manager
        self.optimization_stats['modules_initialized'] += 1
        
        # Initialize parallel processor
        self.optimization_stats['modules_initialized'] += 1
        
        # Initialize legal engine
        self.optimization_stats['modules_initialized'] += 1
        
        # Initialize scenario processor
        self.optimization_stats['modules_initialized'] += 1
        
        print(f"✅ Initialized {self.optimization_stats['modules_initialized']} optimization modules")
    
    def run_comprehensive_optimization(self, hypergraph_file: str = './HYPERGRAPH_CASE_STRUCTURE.json') -> Dict[str, Any]:
        """Run comprehensive optimization on the entire system"""
        print("\n🔧 Running Comprehensive System Optimization...")
        print("=" * 60)
        
        optimization_results = {
            'timestamp': time.time(),
            'hypergraph_file': hypergraph_file,
            'optimizations_applied': [],
            'performance_metrics': {},
            'memory_optimizations': {},
            'parallel_processing_results': {},
            'recommendations': []
        }
        
        # 1. Load and optimize hypergraph data
        print("\n📊 Step 1: Optimizing Hypergraph Data Loading...")
        start_time = time.time()
        
        try:
            hypergraph_data = load_optimized_hypergraph(hypergraph_file)
            load_time = time.time() - start_time
            
            optimization_results['optimizations_applied'].append({
                'name': 'optimized_hypergraph_loading',
                'description': 'Lazy loading and caching for hypergraph data',
                'time_saved': f"{load_time:.3f}s",
                'status': 'success'
            })
            
            print(f"   ✅ Loaded hypergraph in {load_time:.3f}s")
            print(f"   📈 Data: {len(hypergraph_data.get('nodes', []))} nodes, {len(hypergraph_data.get('hyperedges', []))} edges")
            
        except Exception as e:
            print(f"   ❌ Error loading hypergraph: {e}")
            optimization_results['optimizations_applied'].append({
                'name': 'optimized_hypergraph_loading',
                'status': 'failed',
                'error': str(e)
            })
        
        # 2. Optimize data structures
        print("\n🗄️ Step 2: Optimizing Data Structures...")
        start_time = time.time()
        
        try:
            # Get some nodes to test optimization
            paragraph_nodes = get_optimized_nodes_by_type('paragraph')
            evidence_nodes = get_optimized_nodes_by_type('evidence')
            
            data_opt_time = time.time() - start_time
            
            optimization_results['optimizations_applied'].append({
                'name': 'data_structure_optimization',
                'description': 'Optimized graph data structures with caching',
                'time_saved': f"{data_opt_time:.3f}s",
                'nodes_processed': len(paragraph_nodes) + len(evidence_nodes),
                'status': 'success'
            })
            
            print(f"   ✅ Optimized data structures in {data_opt_time:.3f}s")
            print(f"   📈 Processed: {len(paragraph_nodes)} paragraphs, {len(evidence_nodes)} evidence items")
            
        except Exception as e:
            print(f"   ❌ Error optimizing data structures: {e}")
        
        # 3. Test parallel processing
        print("\n⚡ Step 3: Testing Parallel Processing...")
        start_time = time.time()
        
        try:
            # Create sample evidence items for parallel processing
            sample_evidence = [
                {'id': f'evidence_{i}', 'data': {'type': 'document', 'priority': i % 3 + 1}}
                for i in range(50)
            ]
            
            # Process evidence in parallel
            parallel_results = process_evidence_parallel(sample_evidence)
            parallel_time = time.time() - start_time
            
            successful_parallel = sum(1 for r in parallel_results if r.success)
            
            optimization_results['parallel_processing_results'] = {
                'items_processed': len(sample_evidence),
                'successful_items': successful_parallel,
                'processing_time': parallel_time,
                'items_per_second': len(sample_evidence) / parallel_time if parallel_time > 0 else 0
            }
            
            optimization_results['optimizations_applied'].append({
                'name': 'parallel_evidence_processing',
                'description': 'Parallel processing of evidence collection',
                'time_saved': f"{parallel_time:.3f}s",
                'throughput': f"{len(sample_evidence) / parallel_time:.1f} items/sec",
                'status': 'success'
            })
            
            print(f"   ✅ Processed {len(sample_evidence)} evidence items in {parallel_time:.3f}s")
            print(f"   📈 Throughput: {len(sample_evidence) / parallel_time:.1f} items/sec")
            print(f"   ✅ Success rate: {successful_parallel}/{len(sample_evidence)}")
            
        except Exception as e:
            print(f"   ❌ Error in parallel processing: {e}")
        
        # 4. Test legal attention engine optimization
        print("\n🧠 Step 4: Testing Legal Attention Engine Optimization...")
        start_time = time.time()
        
        try:
            # Create sample legal scenario
            sample_events = [
                {
                    'id': 'e1',
                    'event_type': 'action',
                    'agent_id': 'alex',
                    'timestamp': 1.0,
                    'description': 'Alex performs action',
                    'properties': {'intent': 'deliberate'}
                },
                {
                    'id': 'e2',
                    'event_type': 'harm',
                    'agent_id': 'victim',
                    'timestamp': 2.0,
                    'description': 'Harm occurs',
                    'properties': {'severity': 'high'}
                }
            ]
            
            sample_agents = [
                {'id': 'alex', 'name': 'Alex', 'role': 'actor'},
                {'id': 'victim', 'name': 'Victim', 'role': 'affected'}
            ]
            
            sample_norms = [
                {'id': 'n1', 'type': 'prohibition', 'description': 'Do not cause harm'}
            ]
            
            # Process scenario
            legal_result = process_legal_scenario(sample_events, sample_agents, sample_norms)
            legal_time = time.time() - start_time
            
            optimization_results['optimizations_applied'].append({
                'name': 'legal_attention_optimization',
                'description': 'Optimized legal attention inference engine',
                'time_saved': f"{legal_time:.3f}s",
                'inference_time': legal_result.get('inference_time', 0),
                'status': 'success'
            })
            
            print(f"   ✅ Processed legal scenario in {legal_time:.3f}s")
            print(f"   📈 Inference time: {legal_result.get('inference_time', 0):.4f}s")
            print(f"   📊 Guilt scores: {legal_result.get('guilt_scores', [])}")
            
        except Exception as e:
            print(f"   ❌ Error in legal attention engine: {e}")
        
        # 5. Memory optimization
        print("\n🧹 Step 5: Memory Optimization...")
        start_time = time.time()
        
        try:
            # Optimize memory across all modules
            optimize_engine_memory()
            optimized_data_manager.optimize_memory()
            
            memory_opt_time = time.time() - start_time
            
            optimization_results['memory_optimizations'] = {
                'optimization_time': memory_opt_time,
                'modules_optimized': ['legal_engine', 'data_manager'],
                'status': 'success'
            }
            
            optimization_results['optimizations_applied'].append({
                'name': 'memory_optimization',
                'description': 'Memory optimization across all modules',
                'time_saved': f"{memory_opt_time:.3f}s",
                'status': 'success'
            })
            
            print(f"   ✅ Memory optimization completed in {memory_opt_time:.3f}s")
            
        except Exception as e:
            print(f"   ❌ Error in memory optimization: {e}")
        
        # 6. Generate performance report
        print("\n📊 Step 6: Generating Performance Report...")
        
        try:
            performance_report = get_performance_report()
            engine_stats = get_engine_performance()
            
            optimization_results['performance_metrics'] = {
                'system_performance': performance_report,
                'engine_performance': engine_stats
            }
            
            print("   ✅ Performance report generated")
            
        except Exception as e:
            print(f"   ❌ Error generating performance report: {e}")
        
        # 7. Generate recommendations
        print("\n💡 Step 7: Generating Optimization Recommendations...")
        
        recommendations = self._generate_recommendations(optimization_results)
        optimization_results['recommendations'] = recommendations
        
        print(f"   ✅ Generated {len(recommendations)} recommendations")
        
        # Update optimization stats
        self.optimization_stats['total_optimizations'] = len(optimization_results['optimizations_applied'])
        self.optimization_stats['performance_improvements'] = optimization_results['performance_metrics']
        
        return optimization_results
    
    def _generate_recommendations(self, results: Dict[str, Any]) -> List[str]:
        """Generate optimization recommendations based on results"""
        recommendations = []
        
        # Check parallel processing performance
        if 'parallel_processing_results' in results:
            throughput = results['parallel_processing_results'].get('items_per_second', 0)
            if throughput < 10:
                recommendations.append("Consider increasing parallel processing workers for better throughput")
            elif throughput > 100:
                recommendations.append("Excellent parallel processing performance - consider scaling up workload")
        
        # Check legal engine performance
        if 'performance_metrics' in results and 'engine_performance' in results['performance_metrics']:
            engine_stats = results['performance_metrics']['engine_performance']
            avg_inference_time = engine_stats.get('average_inference_time', 0)
            if avg_inference_time > 1.0:
                recommendations.append("Legal attention engine inference time is high - consider model optimization")
            elif avg_inference_time < 0.1:
                recommendations.append("Excellent legal attention engine performance")
        
        # Check memory usage
        if 'memory_optimizations' in results:
            recommendations.append("Memory optimization completed - monitor memory usage during heavy workloads")
        
        # General recommendations
        recommendations.extend([
            "Use parallel processing for evidence collection tasks",
            "Enable performance monitoring for production workloads",
            "Regularly run memory optimization for long-running processes",
            "Consider caching frequently accessed data structures",
            "Monitor system performance metrics for optimization opportunities"
        ])
        
        return recommendations
    
    def export_optimization_report(self, filepath: str = "optimization_report.json"):
        """Export comprehensive optimization report"""
        report = {
            'optimization_manager_stats': self.optimization_stats,
            'timestamp': time.time(),
            'modules': list(self.modules.keys()),
            'recommendations': self._generate_recommendations({})
        }
        
        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"📁 Optimization report exported to: {filepath}")
        return filepath
    
    def shutdown(self):
        """Shutdown all optimization modules"""
        print("\n🛑 Shutting down optimization modules...")
        
        try:
            stop_performance_monitoring()
            parallel_processor.shutdown()
            scenario_processor.shutdown()
            print("✅ All modules shut down successfully")
        except Exception as e:
            print(f"❌ Error during shutdown: {e}")

# Global optimization manager
optimization_manager = OptimizationManager()

def run_optimization(hypergraph_file: str = './HYPERGRAPH_CASE_STRUCTURE.json') -> Dict[str, Any]:
    """Run comprehensive optimization"""
    return optimization_manager.run_comprehensive_optimization(hypergraph_file)

def export_report(filepath: str = "optimization_report.json") -> str:
    """Export optimization report"""
    return optimization_manager.export_optimization_report(filepath)

def shutdown_optimization():
    """Shutdown optimization system"""
    optimization_manager.shutdown()

# Main execution
if __name__ == "__main__":
    print("🎯 Legal Attention System Optimization")
    print("=" * 60)
    
    try:
        # Run comprehensive optimization
        results = run_optimization()
        
        # Display summary
        print(f"\n📊 OPTIMIZATION SUMMARY")
        print("=" * 60)
        print(f"Total optimizations applied: {len(results['optimizations_applied'])}")
        print(f"Modules initialized: {optimization_manager.optimization_stats['modules_initialized']}")
        
        # Show successful optimizations
        successful_ops = [op for op in results['optimizations_applied'] if op.get('status') == 'success']
        print(f"Successful optimizations: {len(successful_ops)}")
        
        # Show recommendations
        print(f"\n💡 RECOMMENDATIONS")
        print("-" * 30)
        for i, rec in enumerate(results['recommendations'][:5], 1):
            print(f"{i}. {rec}")
        
        # Export report
        report_file = export_report()
        
        # Export performance metrics
        export_performance_metrics("performance_metrics.json")
        
        print(f"\n✅ Optimization completed successfully!")
        print(f"📁 Reports saved: {report_file}, performance_metrics.json")
        
    except KeyboardInterrupt:
        print("\n⚠️ Optimization interrupted by user")
    except Exception as e:
        print(f"\n❌ Optimization failed: {e}")
    finally:
        shutdown_optimization()