import { parseAST, execute, memory } from './parse_lisp_code'

describe('Lisp code parser', () => {
  it('should parse a correct call', () => {
    const lispCode = "(first (list 1 (+ 2 3) 9))"
  
    const ast = parseAST(lispCode)
  
    expect(ast).toEqual([ 'first', [ 'list', '1', [ '+', '2', '3' ], '9' ] ])
  })

  it('should parse a correct call', () => {
    const lispCode = "  (  +  2 3 (+ 4 1)  )"
  
    const ast = parseAST(lispCode)
    const result = execute(JSON.parse(JSON.stringify(ast)))
  
    expect(ast).toEqual([ '+', '2', '3', ['+', '4', '1']])    
    expect(result).toEqual(10)
  })

  it('should parse a correct call', () => {
    const lispCode = "(+ 2 3 (- 4 1 (* 4 1 (/ 4 1 (max 4 1)))))"
  
    const ast = parseAST(lispCode)
    const result = execute(JSON.parse(JSON.stringify(ast)))
  
    expect(ast).toEqual([
      '+',
      '2',
      '3',
      ['-', '4', '1', ['*', '4', '1', ['/', '4', '1', ['max', '4', '1']]]],
    ]);
    expect(result).toEqual(4)
  })

  it('should parse an set var function', () => {
    const lispCode = "(setq a 10)"
  
    const ast = parseAST(lispCode)
    const result = execute(JSON.parse(JSON.stringify(ast)))
    
    expect(ast).toEqual(['setq', 'a', '10'])    
    expect(result).toEqual(10)
    expect(memory['a']).toEqual(10)
  })

  it('should parse an if statement and variable', () => {
    const setVarCode = "(setq x 11)"
  
    const astVarCode = parseAST(setVarCode)
    execute(JSON.parse(JSON.stringify(astVarCode)))

    const lispCode = "(* 2 (if (> x 10) 1 2))"
  
    const ast = parseAST(lispCode)
    const result = execute(JSON.parse(JSON.stringify(ast)))

    expect(ast).toEqual(['*', '2', ['if', ['>', 'x', '10'], '1', '2']])    
    expect(result).toEqual(2)
    expect(memory['x']).toEqual(11)
  })

  it('should parse a correct call with two lists next to one another', () => {
    const lispCode = "(+ (* 2 (- 8 3)) (/ 12 3))"
  
    const ast = parseAST(lispCode)
    
    expect(ast).toEqual([ '+', [ '*', '2', [ '-', '8', '3' ] ], [ '/', '12', '3' ] ])    
  })

  it('should throw an error if we have an unclosed bracket', () => {
    let ast
    let error
    const lispCode = "(first (list 1 (+ 2 3 9))"

    try {
      ast = parseAST(lispCode)
    } catch(e) {
      error = e.message
    }

    expect(ast).toBeUndefined()
    expect(error).toEqual('Incorrect list syntax')
  })

  it('should throw an error we have an extra bracket', () => {
    let ast
    let error
    const lispCode = "(first (list 1 (+ 2 3 9))))"

    try {
      ast = parseAST(lispCode)
    } catch(e) {
      error = e.message
    }

    expect(ast).toBeUndefined()
    expect(error).toEqual('Incorrect list syntax')
  })

  it('should throw an error we have an operation outside the list', () => {
    let ast
    let error
    const lispCode = "1 * 2"

    try {
      ast = parseAST(lispCode)
    } catch(e) {
      error = e.message
    }

    expect(ast).toBeUndefined()
    expect(error).toEqual('Incorrect list syntax')
  })

  it('should throw an error we have an operation outside the list', () => {
    let ast
    let error
    const lispCode = "(first (list 1 (+ 2 3 9))) 1 * 2"

    try {
      ast = parseAST(lispCode)
    } catch(e) {
      error = e.message
    }

    expect(ast).toBeUndefined()
    expect(error).toEqual('Incorrect list syntax')
  })

  it('should throw an error if we have an empty list', () => {
    let ast
    let error
    const lispCode = "(first ())"

    try {
      ast = parseAST(lispCode)
    } catch(e) {
      error = e.message
    }

    expect(ast).toBeUndefined();
    expect(error).toEqual('List has to have at least one atom');
  })

})
