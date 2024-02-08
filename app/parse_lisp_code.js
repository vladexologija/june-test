// Write javascript code that takes some Lisp code and returns an abstract syntax tree. 
// The AST should represent the structure of the code and the meaning of each token. 
// For example, if your code is given "(first (list 1 (+ 2 3) 9))", 
// it could return a nested array like ["first", ["list", 1, ["+", 2, 3], 9]].

// add space arround brackets so we don't end up with e.g (list as a token
export const memory = {}

function tokenize(code) {
  const symbols = ['(',')']
  
  for (const symbol of symbols) {
    code = code.replace(new RegExp(`\\${symbol}`, 'g'), ` ${symbol} `)
  }
  
  return code.trim().split(/\s+/)
}

// parsing with semantic checking
function parse(tokens, level = 0) {
  // we have one less bracket
  if (tokens === undefined || tokens.length === 0) throw new SyntaxError('Incorrect list syntax')

  const token = tokens.shift()
  
  if (token === '(') {
    const ast = []
    if (tokens[0] === ')') throw new SyntaxError('List has to have at least one atom')
    
    while (tokens[0] !== ')') {
      ast.push(parse(tokens, level + 1))
    }

    tokens.shift()
    // we've matched all the opening brackets but something is still there
    if (level === 0 && tokens.length !== level) throw new SyntaxError('Incorrect list syntax')
    
    return ast
  } else if ( token === ')') {
    throw new SyntaxError('Incorrect list syntax')
  } else {
    // operation outside the list
    if (level === 0) throw new SyntaxError('Incorrect list syntax')
    return token
  }
}

export function execute(ast) {
  const numericOperations = {
    '*': (sum, item) => sum * item,
    '/': (sum, item) => sum / item,
    '+': (sum, item) => sum + item,
    '-': (sum, item) => sum - item,
    '>': (sum, item) => sum > item,
  }

  if (Array.isArray(ast)) {
    const operator = ast[0]
    ast.shift()
    
    switch (operator) {
      case 'if':        
        const condition = ast[0]
        const trueCondition = ast[1]
        const falseCondition = ast[2]

        return execute(condition)  ? execute(trueCondition) : execute(falseCondition)
      case 'setq':
        memory[ast[0]] = execute(ast[1])
        return memory[ast[0]] 
      case 'max':        
        return ast.reduce((sum, item) => Math.max(sum, execute(item)), -999999999999)  
      case 'first':        
        return ast[0]  
      case 'list':
        return ast.map(arg => execute(arg));
      default:
        if (operator in numericOperations) {
          const func = numericOperations[operator]
          return ast.map(item => execute(item)).reduce((sum, item) => func(sum, item))
        } else {
          throw new SyntaxError('Unsupported operation')
        }
    }
  } else {
    return (!isNaN(ast)) ? parseInt(ast) :  parseInt(memory[ast]) ?? ast
  }

}

export function parseAST(lispCode) {
  const tokens = tokenize(lispCode)
  const ast = parse(tokens)

  return ast
}

