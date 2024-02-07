import { parseAST } from './parse_lisp_code'

describe('Lisp code parser', () => {
  it('should parse a correct call', () => {
    const lispCode = "(first (list 1 (+ 2 3) 9))"
  
    const ast = parseAST(lispCode)
  
    expect(ast).toEqual([ 'first', [ 'list', '1', [ '+', '2', '3' ], '9' ] ])
  })

  it('should parse a correct call', () => {
    const lispCode = "  (  +  2 3 (+ 4 1)  )"
  
    const ast = parseAST(lispCode)
  
    expect(ast).toEqual([ '+', '2', '3', ['+', '4', '1']])    
  })

  it('should parse a correct call', () => {
    const lispCode = "(+ 2 3 (- 4 1 (* 4 1 (/ 4 1 (max 4 1)))))"
  
    const ast = parseAST(lispCode)
  
    expect(ast).toEqual([
      '+',
      '2',
      '3',
      ['-', '4', '1', ['*', '4', '1', ['/', '4', '1', ['max', '4', '1']]]],
    ]);
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
