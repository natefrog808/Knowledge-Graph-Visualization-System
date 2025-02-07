import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlayCircle, PauseCircle, SkipForward, SkipBack, ZoomIn, ZoomOut } from 'lucide-react';
import _ from 'lodash';

const KnowledgeEvolutionViz = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [viewTransform, setViewTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRange, setTimeRange] = useState([0, 100]);
  const [currentTime, setCurrentTime] = useState(0);
  const [filters, setFilters] = useState({
    confidenceThreshold: 0,
    nodeTypes: new Set(['input', 'output', 'context']),
    edgeTypes: new Set(['direct', 'hyperedge', 'temporal'])
  });
  const [layoutType, setLayoutType] = useState('force');  // force, hierarchical, multilevel
  const [searchQuery, setSearchQuery] = useState('');
  
  // Optimization for large graphs
  const visibleNodes = useMemo(() => {
    return graph.nodes.filter(node => {
      const matchesSearch = searchQuery === '' || 
                          node.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesConfidence = node.confidence >= filters.confidenceThreshold;
      const matchesType = filters.nodeTypes.has(node.type);
      return matchesSearch && matchesConfidence && matchesType;
    });
  }, [graph.nodes, searchQuery, filters]);

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    return graph.edges.filter(edge => {
      const connected = visibleNodeIds.has(edge.source) && 
                       visibleNodeIds.has(edge.target);
      const matchesType = filters.edgeTypes.has(edge.type);
      return connected && matchesType;
    });
  }, [visibleNodes, graph.edges, filters]);
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  
  // Force simulation parameters
  const simulation = useRef(null);
  const width = 800;
  const height = 600;
  
  const initializeSimulation = useCallback(() => {
    const nodes = visibleNodes.map(node => ({
      ...node,
      x: node.x || Math.random() * width,
      y: node.y || Math.random() * height
    }));
    
    if (layoutType === 'multilevel') {
      // Implement ForceAtlas2-inspired multilevel layout
      const levels = Math.ceil(Math.log2(nodes.length));
      let currentNodes = [...nodes];
      
      // Coarsening phase
      for (let level = 0; level < levels; level++) {
        // Pair similar nodes based on connectivity and semantic similarity
        const pairs = findNodePairs(currentNodes);
        currentNodes = mergePairs(pairs);
      }
      
      // Refinement phase
      for (let level = levels - 1; level >= 0; level--) {
        // Apply force-directed layout at each level
        applyForceLayout(currentNodes, {
          gravity: 1 / (level + 1),
          repulsion: 10 * (level + 1)
        });
        currentNodes = refineNodes(currentNodes);
      }
      
      // Update original node positions
      nodes.forEach((node, i) => {
        node.x = currentNodes[i].x;
        node.y = currentNodes[i].y;
      });
    }
    
    // Custom force calculations
    const tick = () => {
      nodes.forEach(node => {
        // Apply forces
        node.vx = (node.targetX - node.x) * 0.05;
        node.vy = (node.targetY - node.y) * 0.05;
        
        // Update positions
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary conditions
        node.x = Math.max(50, Math.min(width - 50, node.x));
        node.y = Math.max(50, Math.min(height - 50, node.y));
      });
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };
    
    simulation.current = { nodes, tick };
  }, [graph, isPlaying, width, height]);

  useEffect(() => {
    initializeSimulation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeSimulation]);

  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  const renderNodes = () => {
    return simulation.current?.nodes.map((node) => {
      const isSelected = selectedNode?.id === node.id;
      const radius = isSelected ? 8 : 6;
      const confidence = node.confidence || 0.5;
      const opacity = 0.3 + (confidence * 0.7);
      
      return (
        <g 
          key={node.id}
          transform={`translate(${node.x},${node.y})`}
          onClick={() => handleNodeClick(node)}
          className="cursor-pointer"
        >
          <circle
            r={radius}
            fill={getNodeColor(node.type)}
            opacity={opacity}
            className={`transition-all duration-300 ease-in-out ${
              isSelected ? 'stroke-2 stroke-blue-500' : ''
            }`}
          />
          {node.confidence > 0.8 && (
            <circle
              r={radius + 2}
              fill="none"
              stroke={getNodeColor(node.type)}
              strokeWidth="1"
              opacity="0.3"
              className="animate-pulse"
            />
          )}
          {isSelected && (
            <text
              y={-radius - 5}
              textAnchor="middle"
              className="text-xs fill-gray-700"
            >
              {node.label}
            </text>
          )}
        </g>
      );
    });
  };

  const renderEdges = () => {
    return graph.edges.map((edge) => {
      const source = simulation.current?.nodes.find(n => n.id === edge.source);
      const target = simulation.current?.nodes.find(n => n.id === edge.target);
      
      if (!source || !target) return null;
      
      const confidence = edge.confidence || 0.5;
      const opacity = 0.2 + (confidence * 0.6);
      
      if (edge.type === 'hyperedge') {
        const controlPoints = generateHyperedgeControlPoints([source, target]);
        return (
          <path
            key={edge.id}
            d={generateCurvePath(controlPoints)}
            stroke={getEdgeColor(edge.type)}
            strokeWidth={1 + confidence}
            fill="none"
            opacity={opacity}
            className="transition-all duration-300 ease-in-out"
          />
        );
      }
      
      return (
        <line
          key={edge.id}
          x1={source.x}
          y1={source.y}
          x2={target.x}
          y2={target.y}
          stroke={getEdgeColor(edge.type)}
          strokeWidth={1 + confidence}
          opacity={opacity}
          className="transition-all duration-300 ease-in-out"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  const generateHyperedgeControlPoints = (nodes) => {
    // Calculate control points for smooth curves
    const points = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const current = nodes[i];
      const next = nodes[i + 1];
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const norm = Math.sqrt(dx * dx + dy * dy);
      const offset = 30 * (i % 2 ? 1 : -1);
      points.push({
        x: midX - (dy / norm) * offset,
        y: midY + (dx / norm) * offset
      });
    }
    return points;
  };

  const generateCurvePath = (points) => {
    if (points.length < 1) return '';
    return `M ${points[0].x} ${points[0].y} ` +
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  };

  const handleZoom = (delta) => {
    setViewTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(2, prev.scale + delta))
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Knowledge Evolution Visualization</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={() => handleZoom(0.1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="border border-gray-200 rounded-lg bg-white"
            style={{
              transform: `scale(${viewTransform.scale}) 
                         translate(${viewTransform.x}px, ${viewTransform.y}px)`
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#666"
                  opacity="0.6"
                />
              </marker>
            </defs>
            <g className="edges">{renderEdges()}</g>
            <g className="nodes">{renderNodes()}</g>
          </svg>
          
          <div className="absolute bottom-4 left-0 right-0 mx-4 flex flex-col gap-2 bg-white/90 p-4 rounded-lg">
            {/* Time Control */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isPlaying ? (
                  <PauseCircle size={24} />
                ) : (
                  <PlayCircle size={24} />
                )}
              </button>
              <input
                type="range"
                min={timeRange[0]}
                max={timeRange[1]}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                className="flex-grow"
              />
              <span className="text-sm font-mono">
                T: {currentTime}
              </span>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <select
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="force">Force Layout</option>
                <option value="hierarchical">Hierarchical</option>
                <option value="multilevel">Multilevel</option>
              </select>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.confidenceThreshold * 100}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  confidenceThreshold: parseInt(e.target.value) / 100
                }))}
                className="w-32"
              />
              <span className="text-sm">
                Confidence: {(filters.confidenceThreshold * 100).toFixed(0)}%
              </span>
            </div>
            
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {Array.from(filters.nodeTypes).map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    nodeTypes: prev.nodeTypes.has(type)
                      ? new Set([...prev.nodeTypes].filter(t => t !== type))
                      : new Set([...prev.nodeTypes, type])
                  }))}
                  className={`px-2 py-1 rounded text-sm ${
                    filters.nodeTypes.has(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {selectedNode && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold mb-2">{selectedNode.label}</h3>
              <div className="text-sm">
                <p>Type: {selectedNode.type}</p>
                <p>Confidence: {(selectedNode.confidence * 100).toFixed(1)}%</p>
                <p>Connections: {
                  graph.edges.filter(e => 
                    e.source === selectedNode.id || 
                    e.target === selectedNode.id
                  ).length
                }</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Input Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Output Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Context Nodes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeEvolutionViz;
