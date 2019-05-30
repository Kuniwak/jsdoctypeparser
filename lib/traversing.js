'use strict';

/**
 * Traverse the specified AST.
 * @param {{ type: NodeType }} node AST to traverse.
 * @param {function({ type: NodeType })?} opt_onEnter Callback for onEnter.
 * @param {function({ type: NodeType })?} opt_onLeave Callback for onLeave.
 */
function traverse(node, opt_onEnter, opt_onLeave) {
  if (opt_onEnter) opt_onEnter(node);

  const childNodes = _collectChildNodes(node);
  childNodes.forEach(function(childNode) {
    traverse(childNode, opt_onEnter, opt_onLeave);
  });

  if (opt_onLeave) opt_onLeave(node);
}


/**
 * @private
 */
const _PropertyAccessor = {
  NODE (fn, node) {
    fn(node);
  },
  NODE_LIST (fn, nodes) {
    nodes.forEach(function(node) {
      fn(node);
    });
  },
  NULLABLE_NODE (fn, opt_node) {
    if (opt_node) fn(opt_node);
  },
};


/** @private */
const _childNodesMap = {
  NAME: {},
  NAMED_PARAMETER: {
    typeName: _PropertyAccessor.NULLABLE_NODE,
  },
  MEMBER: {
    owner: _PropertyAccessor.NODE,
  },
  UNION: {
    left: _PropertyAccessor.NODE,
    right: _PropertyAccessor.NODE,
  },
  VARIADIC: {
    value: _PropertyAccessor.NODE,
  },
  RECORD: {
    entries: _PropertyAccessor.NODE_LIST,
  },
  RECORD_ENTRY: {
    value: _PropertyAccessor.NULLABLE_NODE,
  },
  TUPLE: {
    entries: _PropertyAccessor.NODE_LIST,
  },
  GENERIC: {
    subject: _PropertyAccessor.NODE,
    objects: _PropertyAccessor.NODE_LIST,
  },
  MODULE: {
    value: _PropertyAccessor.NODE,
  },
  OPTIONAL: {
    value: _PropertyAccessor.NODE,
  },
  NULLABLE: {
    value: _PropertyAccessor.NODE,
  },
  NOT_NULLABLE: {
    value: _PropertyAccessor.NODE,
  },
  FUNCTION: {
    params: _PropertyAccessor.NODE_LIST,
    returns: _PropertyAccessor.NULLABLE_NODE,
    this: _PropertyAccessor.NULLABLE_NODE,
    new: _PropertyAccessor.NULLABLE_NODE,
  },
  ARROW: {
    params: _PropertyAccessor.NODE_LIST,
    returns: _PropertyAccessor.NULLABLE_NODE,
    new: _PropertyAccessor.NULLABLE_NODE,
  },
  ANY: {},
  UNKNOWN: {},
  INNER_MEMBER: {
    owner: _PropertyAccessor.NODE,
  },
  INSTANCE_MEMBER: {
    owner: _PropertyAccessor.NODE,
  },
  STRING_VALUE: {},
  NUMBER_VALUE: {},
  EXTERNAL: {
    value: _PropertyAccessor.NODE,
  },
  FILE_PATH: {},
  PARENTHESIS: {
    value: _PropertyAccessor.NODE,
  },
  TYPE_QUERY: {
    name: _PropertyAccessor.NODE,
  },
  IMPORT: {
    path: _PropertyAccessor.NODE,
  },
};


/** @private */
function _collectChildNodes(node) {
  const childNodes = [];
  const propAccessorMap = _childNodesMap[node.type];

  Object.keys(propAccessorMap).forEach(function(propName) {
    const propAccessor = propAccessorMap[propName];
    propAccessor(childNodes.push.bind(childNodes), node[propName]);
  });

  return childNodes;
}

module.exports = {
  traverse,
};
