"""
Optimized Data Structure Manager
Provides efficient data structures and operations for the legal attention system
"""

import json
import pickle
import sqlite3
from pathlib import Path
from typing import Dict, List, Any, Optional, Set, Tuple, Union
from dataclasses import dataclass, field
from collections import defaultdict, deque
import threading
import time
from functools import lru_cache
import weakref

@dataclass
class DataNode:
    """Optimized data node with weak references"""
    id: str
    type: str
    data: Dict[str, Any]
    _connections: Set[str] = field(default_factory=set)
    _last_accessed: float = field(default_factory=time.time)
    
    def __post_init__(self):
        self._connections = set()

class OptimizedGraph:
    """High-performance graph data structure with lazy loading"""
    
    def __init__(self, max_cache_size: int = 10000):
        self.max_cache_size = max_cache_size
        self._nodes = {}  # id -> DataNode
        self._edges = defaultdict(set)  # node_id -> set of connected node_ids
        self._type_index = defaultdict(set)  # type -> set of node_ids
        self._cache_hits = 0
        self._cache_misses = 0
        self._lock = threading.RLock()
        
    def add_node(self, node_id: str, node_type: str, data: Dict[str, Any]) -> DataNode:
        """Add a node to the graph"""
        with self._lock:
            if node_id in self._nodes:
                # Update existing node
                self._nodes[node_id].data.update(data)
                self._nodes[node_id]._last_accessed = time.time()
                return self._nodes[node_id]
            
            # Create new node
            node = DataNode(id=node_id, type=node_type, data=data)
            self._nodes[node_id] = node
            self._type_index[node_type].add(node_id)
            
            # Manage cache size
            if len(self._nodes) > self.max_cache_size:
                self._evict_oldest()
            
            return node
    
    def get_node(self, node_id: str) -> Optional[DataNode]:
        """Get a node by ID with caching"""
        with self._lock:
            if node_id in self._nodes:
                self._nodes[node_id]._last_accessed = time.time()
                self._cache_hits += 1
                return self._nodes[node_id]
            
            self._cache_misses += 1
            return None
    
    def add_edge(self, from_id: str, to_id: str, weight: float = 1.0):
        """Add an edge between nodes"""
        with self._lock:
            self._edges[from_id].add(to_id)
            # Update node connections
            if from_id in self._nodes:
                self._nodes[from_id]._connections.add(to_id)
            if to_id in self._nodes:
                self._nodes[to_id]._connections.add(from_id)
    
    def get_connections(self, node_id: str) -> Set[str]:
        """Get all connections for a node"""
        with self._lock:
            return self._edges.get(node_id, set()).copy()
    
    def get_nodes_by_type(self, node_type: str) -> List[DataNode]:
        """Get all nodes of a specific type"""
        with self._lock:
            return [self._nodes[node_id] for node_id in self._type_index[node_type] 
                   if node_id in self._nodes]
    
    def _evict_oldest(self):
        """Evict the least recently accessed node"""
        if not self._nodes:
            return
        
        oldest_id = min(self._nodes.keys(), 
                       key=lambda x: self._nodes[x]._last_accessed)
        
        node = self._nodes[oldest_id]
        node_type = node.type
        
        # Remove from type index
        self._type_index[node_type].discard(oldest_id)
        
        # Remove from edges
        if oldest_id in self._edges:
            del self._edges[oldest_id]
        
        # Remove from other nodes' connections
        for other_id, connections in self._edges.items():
            connections.discard(oldest_id)
        
        # Remove the node
        del self._nodes[oldest_id]
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self._cache_hits + self._cache_misses
        hit_rate = self._cache_hits / total_requests if total_requests > 0 else 0
        
        return {
            'cache_hits': self._cache_hits,
            'cache_misses': self._cache_misses,
            'hit_rate': hit_rate,
            'total_nodes': len(self._nodes),
            'total_edges': sum(len(connections) for connections in self._edges.values())
        }

class OptimizedJSONLoader:
    """Optimized JSON file loader with caching and lazy loading"""
    
    def __init__(self, cache_size: int = 100):
        self.cache_size = cache_size
        self._file_cache = {}
        self._access_times = {}
        self._lock = threading.RLock()
    
    @lru_cache(maxsize=50)
    def load_json(self, filepath: str) -> Dict[str, Any]:
        """Load JSON file with caching"""
        with self._lock:
            filepath = str(Path(filepath).resolve())
            
            if filepath in self._file_cache:
                self._access_times[filepath] = time.time()
                return self._file_cache[filepath]
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Manage cache size
                if len(self._file_cache) >= self.cache_size:
                    self._evict_oldest_file()
                
                self._file_cache[filepath] = data
                self._access_times[filepath] = time.time()
                return data
                
            except Exception as e:
                print(f"Error loading JSON file {filepath}: {e}")
                return {}
    
    def _evict_oldest_file(self):
        """Evict the least recently accessed file"""
        if not self._access_times:
            return
        
        oldest_file = min(self._access_times.keys(), 
                         key=lambda x: self._access_times[x])
        
        if oldest_file in self._file_cache:
            del self._file_cache[oldest_file]
        del self._access_times[oldest_file]
    
    def clear_cache(self):
        """Clear all cached files"""
        with self._lock:
            self._file_cache.clear()
            self._access_times.clear()

class OptimizedDatabase:
    """Optimized database operations with connection pooling"""
    
    def __init__(self, db_path: str = ":memory:"):
        self.db_path = db_path
        self._connection_pool = deque(maxlen=10)
        self._lock = threading.RLock()
        self._init_database()
    
    def _init_database(self):
        """Initialize database schema"""
        with self._get_connection() as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS nodes (
                    id TEXT PRIMARY KEY,
                    type TEXT NOT NULL,
                    data TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS edges (
                    from_id TEXT NOT NULL,
                    to_id TEXT NOT NULL,
                    weight REAL DEFAULT 1.0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (from_id, to_id),
                    FOREIGN KEY (from_id) REFERENCES nodes(id),
                    FOREIGN KEY (to_id) REFERENCES nodes(id)
                )
            ''')
            
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(type)
            ''')
            
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_edges_from ON edges(from_id)
            ''')
            
            conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_edges_to ON edges(to_id)
            ''')
    
    def _get_connection(self):
        """Get database connection from pool or create new one"""
        with self._lock:
            if self._connection_pool:
                return self._connection_pool.popleft()
            else:
                return sqlite3.connect(self.db_path, check_same_thread=False)
    
    def _return_connection(self, conn):
        """Return connection to pool"""
        with self._lock:
            if len(self._connection_pool) < 10:
                self._connection_pool.append(conn)
            else:
                conn.close()
    
    def store_node(self, node_id: str, node_type: str, data: Dict[str, Any]):
        """Store a node in the database"""
        with self._get_connection() as conn:
            conn.execute('''
                INSERT OR REPLACE INTO nodes (id, type, data, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ''', (node_id, node_type, json.dumps(data)))
            conn.commit()
    
    def get_node(self, node_id: str) -> Optional[Dict[str, Any]]:
        """Get a node from the database"""
        with self._get_connection() as conn:
            cursor = conn.execute('SELECT data FROM nodes WHERE id = ?', (node_id,))
            row = cursor.fetchone()
            if row:
                return json.loads(row[0])
            return None
    
    def get_nodes_by_type(self, node_type: str) -> List[Dict[str, Any]]:
        """Get all nodes of a specific type"""
        with self._get_connection() as conn:
            cursor = conn.execute('SELECT data FROM nodes WHERE type = ?', (node_type,))
            return [json.loads(row[0]) for row in cursor.fetchall()]
    
    def store_edge(self, from_id: str, to_id: str, weight: float = 1.0):
        """Store an edge in the database"""
        with self._get_connection() as conn:
            conn.execute('''
                INSERT OR REPLACE INTO edges (from_id, to_id, weight)
                VALUES (?, ?, ?)
            ''', (from_id, to_id, weight))
            conn.commit()
    
    def get_connections(self, node_id: str) -> List[Tuple[str, float]]:
        """Get all connections for a node"""
        with self._get_connection() as conn:
            cursor = conn.execute('''
                SELECT to_id, weight FROM edges WHERE from_id = ?
            ''', (node_id,))
            return cursor.fetchall()

class OptimizedDataManager:
    """Main data manager that coordinates all optimized data structures"""
    
    def __init__(self, cache_size: int = 10000):
        self.graph = OptimizedGraph(cache_size)
        self.json_loader = OptimizedJSONLoader()
        self.database = OptimizedDatabase()
        self._performance_stats = defaultdict(list)
    
    def load_hypergraph_data(self, filepath: str) -> Dict[str, Any]:
        """Load hypergraph data with optimization"""
        data = self.json_loader.load_json(filepath)
        
        # Pre-populate graph with nodes
        for node_data in data.get('nodes', []):
            self.graph.add_node(
                node_data['id'],
                node_data['type'],
                node_data.get('properties', {})
            )
        
        # Pre-populate graph with edges
        for edge_data in data.get('hyperedges', []):
            for i, from_node in enumerate(edge_data.get('nodes', [])):
                for to_node in edge_data.get('nodes', [i+1:], []):
                    self.graph.add_edge(from_node, to_node, edge_data.get('weight', 1.0))
        
        return data
    
    def get_optimized_node(self, node_id: str) -> Optional[DataNode]:
        """Get a node with optimized caching"""
        return self.graph.get_node(node_id)
    
    def get_optimized_connections(self, node_id: str) -> Set[str]:
        """Get node connections with optimization"""
        return self.graph.get_connections(node_id)
    
    def get_optimized_nodes_by_type(self, node_type: str) -> List[DataNode]:
        """Get nodes by type with optimization"""
        return self.graph.get_nodes_by_type(node_type)
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Get comprehensive performance report"""
        return {
            'graph_stats': self.graph.get_cache_stats(),
            'json_loader_stats': {
                'cached_files': len(self.json_loader._file_cache),
                'access_times': len(self.json_loader._access_times)
            },
            'database_stats': {
                'connection_pool_size': len(self.database._connection_pool)
            }
        }
    
    def optimize_memory(self):
        """Run memory optimization"""
        # Clear least used data
        self.graph._evict_oldest()
        self.json_loader.clear_cache()
        
        # Force garbage collection
        import gc
        gc.collect()
    
    def export_optimized_data(self, filepath: str):
        """Export optimized data structures"""
        report = self.get_performance_report()
        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2, default=str)

# Global optimized data manager
optimized_data_manager = OptimizedDataManager()

# Convenience functions
def load_optimized_hypergraph(filepath: str) -> Dict[str, Any]:
    """Load hypergraph data with optimization"""
    return optimized_data_manager.load_hypergraph_data(filepath)

def get_optimized_node(node_id: str) -> Optional[DataNode]:
    """Get optimized node"""
    return optimized_data_manager.get_optimized_node(node_id)

def get_optimized_connections(node_id: str) -> Set[str]:
    """Get optimized connections"""
    return optimized_data_manager.get_optimized_connections(node_id)

def get_optimized_nodes_by_type(node_type: str) -> List[DataNode]:
    """Get optimized nodes by type"""
    return optimized_data_manager.get_optimized_nodes_by_type(node_type)

# Example usage
if __name__ == "__main__":
    print("🚀 Optimized Data Manager")
    print("=" * 50)
    
    # Load hypergraph data
    print("Loading hypergraph data...")
    data = load_optimized_hypergraph('./HYPERGRAPH_CASE_STRUCTURE.json')
    print(f"Loaded {len(data.get('nodes', []))} nodes and {len(data.get('hyperedges', []))} edges")
    
    # Test optimized operations
    print("\nTesting optimized operations...")
    
    # Get some nodes
    nodes = get_optimized_nodes_by_type('paragraph')
    print(f"Found {len(nodes)} paragraph nodes")
    
    if nodes:
        first_node = nodes[0]
        connections = get_optimized_connections(first_node.id)
        print(f"First node '{first_node.id}' has {len(connections)} connections")
    
    # Get performance report
    report = optimized_data_manager.get_performance_report()
    print(f"\n📊 Performance Report:")
    print(f"Graph cache hit rate: {report['graph_stats']['hit_rate']:.2%}")
    print(f"Cached files: {report['json_loader_stats']['cached_files']}")
    
    # Optimize memory
    print("\n🧹 Optimizing memory...")
    optimized_data_manager.optimize_memory()
    
    print("\n✅ Optimized data manager ready!")