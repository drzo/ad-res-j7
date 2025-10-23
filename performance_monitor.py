"""
Performance Monitoring and Profiling Tools
Provides comprehensive performance monitoring for the legal attention system
"""

import time
import psutil
import gc
from functools import wraps
from typing import Dict, List, Any, Callable
from dataclasses import dataclass
from datetime import datetime
import json
import threading
from collections import defaultdict, deque

@dataclass
class PerformanceMetric:
    """Individual performance metric"""
    name: str
    value: float
    unit: str
    timestamp: datetime
    context: Dict[str, Any] = None

class PerformanceMonitor:
    """Comprehensive performance monitoring system"""
    
    def __init__(self, max_history: int = 1000):
        self.max_history = max_history
        self.metrics_history = deque(maxlen=max_history)
        self.function_timings = defaultdict(list)
        self.memory_usage = deque(maxlen=100)
        self.cpu_usage = deque(maxlen=100)
        self.active_monitoring = False
        self.monitor_thread = None
        self.lock = threading.Lock()
        
    def start_monitoring(self, interval: float = 1.0):
        """Start background monitoring"""
        if self.active_monitoring:
            return
            
        self.active_monitoring = True
        self.monitor_thread = threading.Thread(
            target=self._monitor_loop, 
            args=(interval,),
            daemon=True
        )
        self.monitor_thread.start()
        
    def stop_monitoring(self):
        """Stop background monitoring"""
        self.active_monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join()
            
    def _monitor_loop(self, interval: float):
        """Background monitoring loop"""
        while self.active_monitoring:
            try:
                # Memory usage
                memory_info = psutil.virtual_memory()
                self.memory_usage.append({
                    'timestamp': datetime.now(),
                    'used_mb': memory_info.used / 1024 / 1024,
                    'available_mb': memory_info.available / 1024 / 1024,
                    'percent': memory_info.percent
                })
                
                # CPU usage
                cpu_percent = psutil.cpu_percent(interval=0.1)
                self.cpu_usage.append({
                    'timestamp': datetime.now(),
                    'percent': cpu_percent
                })
                
                time.sleep(interval)
            except Exception as e:
                print(f"Monitoring error: {e}")
                time.sleep(interval)
    
    def record_metric(self, name: str, value: float, unit: str = "", context: Dict = None):
        """Record a custom metric"""
        with self.lock:
            metric = PerformanceMetric(
                name=name,
                value=value,
                unit=unit,
                timestamp=datetime.now(),
                context=context or {}
            )
            self.metrics_history.append(metric)
    
    def time_function(self, func_name: str = None):
        """Decorator to time function execution"""
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            def wrapper(*args, **kwargs):
                start_time = time.perf_counter()
                start_memory = psutil.Process().memory_info().rss
                
                try:
                    result = func(*args, **kwargs)
                    return result
                finally:
                    end_time = time.perf_counter()
                    end_memory = psutil.Process().memory_info().rss
                    
                    execution_time = end_time - start_time
                    memory_delta = end_memory - start_memory
                    
                    name = func_name or f"{func.__module__}.{func.__name__}"
                    
                    with self.lock:
                        self.function_timings[name].append({
                            'execution_time': execution_time,
                            'memory_delta': memory_delta,
                            'timestamp': datetime.now(),
                            'args_count': len(args),
                            'kwargs_count': len(kwargs)
                        })
                    
                    self.record_metric(
                        f"function.{name}.execution_time",
                        execution_time,
                        "seconds",
                        {"function": name}
                    )
                    
                    if memory_delta != 0:
                        self.record_metric(
                            f"function.{name}.memory_delta",
                            memory_delta,
                            "bytes",
                            {"function": name}
                        )
            
            return wrapper
        return decorator
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get comprehensive performance summary"""
        with self.lock:
            # Function timing statistics
            function_stats = {}
            for func_name, timings in self.function_timings.items():
                if timings:
                    execution_times = [t['execution_time'] for t in timings]
                    memory_deltas = [t['memory_delta'] for t in timings]
                    
                    function_stats[func_name] = {
                        'call_count': len(timings),
                        'avg_execution_time': sum(execution_times) / len(execution_times),
                        'max_execution_time': max(execution_times),
                        'min_execution_time': min(execution_times),
                        'total_execution_time': sum(execution_times),
                        'avg_memory_delta': sum(memory_deltas) / len(memory_deltas),
                        'max_memory_delta': max(memory_deltas),
                        'min_memory_delta': min(memory_deltas)
                    }
            
            # Memory usage statistics
            memory_stats = {}
            if self.memory_usage:
                memory_values = [m['used_mb'] for m in self.memory_usage]
                memory_stats = {
                    'current_mb': memory_values[-1],
                    'avg_mb': sum(memory_values) / len(memory_values),
                    'max_mb': max(memory_values),
                    'min_mb': min(memory_values)
                }
            
            # CPU usage statistics
            cpu_stats = {}
            if self.cpu_usage:
                cpu_values = [c['percent'] for c in self.cpu_usage]
                cpu_stats = {
                    'current_percent': cpu_values[-1],
                    'avg_percent': sum(cpu_values) / len(cpu_values),
                    'max_percent': max(cpu_values),
                    'min_percent': min(cpu_values)
                }
            
            # Recent metrics
            recent_metrics = list(self.metrics_history)[-50:] if self.metrics_history else []
            
            return {
                'timestamp': datetime.now().isoformat(),
                'function_statistics': function_stats,
                'memory_statistics': memory_stats,
                'cpu_statistics': cpu_stats,
                'recent_metrics': [
                    {
                        'name': m.name,
                        'value': m.value,
                        'unit': m.unit,
                        'timestamp': m.timestamp.isoformat(),
                        'context': m.context
                    } for m in recent_metrics
                ],
                'gc_statistics': {
                    'collections': gc.get_count(),
                    'thresholds': gc.get_threshold()
                }
            }
    
    def get_slowest_functions(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get the slowest functions by average execution time"""
        with self.lock:
            function_averages = []
            for func_name, timings in self.function_timings.items():
                if timings:
                    avg_time = sum(t['execution_time'] for t in timings) / len(timings)
                    function_averages.append({
                        'function': func_name,
                        'avg_execution_time': avg_time,
                        'call_count': len(timings),
                        'total_time': sum(t['execution_time'] for t in timings)
                    })
            
            return sorted(function_averages, key=lambda x: x['avg_execution_time'], reverse=True)[:limit]
    
    def get_memory_hogs(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get functions that use the most memory"""
        with self.lock:
            memory_averages = []
            for func_name, timings in self.function_timings.items():
                if timings:
                    avg_memory = sum(t['memory_delta'] for t in timings) / len(timings)
                    if avg_memory > 0:  # Only include functions that increase memory
                        memory_averages.append({
                            'function': func_name,
                            'avg_memory_delta': avg_memory,
                            'call_count': len(timings),
                            'total_memory_delta': sum(t['memory_delta'] for t in timings)
                        })
            
            return sorted(memory_averages, key=lambda x: x['avg_memory_delta'], reverse=True)[:limit]
    
    def export_metrics(self, filepath: str):
        """Export all metrics to JSON file"""
        summary = self.get_performance_summary()
        with open(filepath, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
    
    def clear_metrics(self):
        """Clear all stored metrics"""
        with self.lock:
            self.metrics_history.clear()
            self.function_timings.clear()
            self.memory_usage.clear()
            self.cpu_usage.clear()

# Global performance monitor instance
performance_monitor = PerformanceMonitor()

def monitor_performance(func_name: str = None):
    """Convenience decorator for performance monitoring"""
    return performance_monitor.time_function(func_name)

def start_performance_monitoring(interval: float = 1.0):
    """Start global performance monitoring"""
    performance_monitor.start_monitoring(interval)

def stop_performance_monitoring():
    """Stop global performance monitoring"""
    performance_monitor.stop_monitoring()

def get_performance_report() -> Dict[str, Any]:
    """Get current performance report"""
    return performance_monitor.get_performance_summary()

def export_performance_metrics(filepath: str = "performance_metrics.json"):
    """Export performance metrics to file"""
    performance_monitor.export_metrics(filepath)

# Example usage and testing
if __name__ == "__main__":
    print("🔍 Performance Monitoring System")
    print("=" * 50)
    
    # Start monitoring
    start_performance_monitoring(interval=0.5)
    
    # Example function with monitoring
    @monitor_performance("example_function")
    def example_function(n: int):
        """Example function that does some work"""
        result = 0
        for i in range(n):
            result += i ** 2
        return result
    
    # Run some test functions
    print("Running performance tests...")
    for i in range(5):
        example_function(10000)
        time.sleep(0.1)
    
    # Get performance report
    report = get_performance_report()
    print(f"\n📊 Performance Summary:")
    print(f"Functions monitored: {len(report['function_statistics'])}")
    print(f"Memory usage: {report['memory_statistics'].get('current_mb', 0):.1f} MB")
    print(f"CPU usage: {report['cpu_statistics'].get('current_percent', 0):.1f}%")
    
    # Show slowest functions
    slowest = performance_monitor.get_slowest_functions(5)
    print(f"\n🐌 Slowest Functions:")
    for func in slowest:
        print(f"  {func['function']}: {func['avg_execution_time']:.4f}s avg ({func['call_count']} calls)")
    
    # Export metrics
    export_performance_metrics("test_performance_metrics.json")
    print(f"\n📁 Metrics exported to: test_performance_metrics.json")
    
    # Stop monitoring
    stop_performance_monitoring()
    print("\n✅ Performance monitoring complete!")