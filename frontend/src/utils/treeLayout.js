import * as d3 from 'd3';

/**
 * Transforms an array of people and relationships into a hierarchical layout 
 * suitable for rendering with React.
 * 
 * @param {Array} people - Array of person objects
 * @param {string} rootPersonId - ID of the root person
 * @returns {Object} { nodes, links } containing x,y coordinates
 */
export function buildTreeLayout(people, rootPersonId) {
  // Defensive check
  if (!people || !people.length || !rootPersonId) {
    return { nodes: [], links: [] };
  }

  // Find the root person
  let rootData = people.find(p => p.id === rootPersonId);
  // Re-fallback to the first person if rootPersonId is somehow invalid
  if (!rootData) rootData = people[0];

  // Map to store built nodes for deduping/referencing
  const nodesMap = new Map();

  // Helper function to recursively build a nested hierarchy from our flat relationships
  function buildHierarchy(personId, depth = 0, passedIds = new Set()) {
    if (passedIds.has(personId)) return null; // Avoid circular reference
    
    const person = people.find(p => p.id === personId);
    if (!person) return null;

    passedIds.add(personId);

    // A shallow copy for the recursive tree structure
    const node = { ...person, children: [], _depth: depth };

    // Find children relationships where this person is the parent
    // Use marriages array which is our source of truth for children based on BACKEND_SPEC
    if (person.marriages && person.marriages.length > 0) {
      person.marriages.forEach(marriage => {
        if (marriage.children_ids && marriage.children_ids.length > 0) {
          marriage.children_ids.forEach(childId => {
            const childNode = buildHierarchy(childId, depth + 1, new Set(passedIds));
            if (childNode) {
              node.children.push(childNode);
            }
          });
        }
      });
    }

    nodesMap.set(person.id, node);
    return node;
  }

  const nestedData = buildHierarchy(rootData.id);

  if (!nestedData) {
    return { nodes: [], links: [] };
  }

  // Setup D3 layout
  // D3 nodeSize gives fixed spacing per node (x, y coordinates).
  const treeLayout = d3.tree()
    .nodeSize([220, 140]);   // tighter — auto-fit zoom will handle scale
    
  const rootHierarchy = d3.hierarchy(nestedData);

  // Calculate coordinates
  treeLayout(rootHierarchy);

  // Extract plottable nodes and links
  const nodes = rootHierarchy.descendants();
  const links = rootHierarchy.links();

  // ── Position spouses beside their partners ──────────────────────
  const spouseNodes = [];
  const marriageLinks = [];

  nodes.forEach(node => {
    if (!node.data.marriages) return;
    node.data.marriages.forEach(marriage => {
      if (!marriage.spouse_id) return;
      const spousePerson = people.find(p => p.id === marriage.spouse_id);
      if (!spousePerson) return;
      // Skip if spouse is already in the hierarchy (someone's child too)
      if (nodes.some(n => n.data.id === spousePerson.id)) return;
      if (spouseNodes.some(n => n.data.id === spousePerson.id)) return;

      const spouseNode = {
        x: node.x + 130,   // tighter spouse offset matching reduced nodeSize
        y: node.y,
        depth: node.depth,
        data: { ...spousePerson },
        isSpouse: true,
      };
      spouseNodes.push(spouseNode);
      marriageLinks.push({
        source: { x: node.x, y: node.y, data: node.data },
        target: { x: spouseNode.x, y: spouseNode.y, data: spouseNode.data },
        type: 'marriage',
      });
    });
  });

  return { nodes: [...nodes, ...spouseNodes], links: [...links, ...marriageLinks] };
}

/**
 * Generates an SVG path string for a vertical curved connector line.
 * Used for parent-child connections.
 */
export function generateCurvedPath(sourceX, sourceY, targetX, targetY) {
  // We use D3's linkVertical for a smooth parent-child curve 
  const linkGenerator = d3.linkVertical()
    .x(d => d.x)
    .y(d => d.y);
    
  return linkGenerator({
    source: { x: sourceX, y: sourceY },
    target: { x: targetX, y: targetY }
  });
}
