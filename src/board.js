// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let board = Array.from( { length: 8 }, () => Array.from( { length: 8 } ) );
  for ( let i = 0; i <= 1; i++ ) {
    board[4 - i][3 + i] = new Piece( 'black' );
    board[3 + i][3 + i] = new Piece( 'white' );
  }
  return board;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];


Board.mutatePosition = function ( pos, dir ) {
  return pos.map(( ele, i ) => ele + dir[i] );
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  for( let i = 0; i <= 1; i++ ) { if( pos[i] < 0 || pos[i] >= 8 ) return false; }
  return true;
};

// function InvalidPosition( pos ) {
//   this.pos = pos;
//   this.message = 'is not a valid position on the 8x8 board';
//   this.toString = `[${this.pos}] ${this.message}`;
// }

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if ( !this.isValidPos( pos )) throw new Error( 'Not valid pos!' );

  let [ x, y ] = pos;
  return this.grid[x][y];
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  const piece = this.getPiece( pos );
  return piece ? piece.color === color : false;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  const piece = this.getPiece( pos );
  return piece ? true : false;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  const newPos = this.constructor.mutatePosition( pos, dir );
  if ( !this.isValidPos( pos ) || !this.isValidPos( newPos ) || !this.isOccupied( newPos )) {
    return [];
  }
  
  piecesToFlip = piecesToFlip ? piecesToFlip : [];
  const piece = this.getPiece( newPos );

  if ( piece && piece.oppColor() === color ) {
    piecesToFlip.push( newPos );
  } else {
    return piecesToFlip;
  }

  return this._positionsToFlip( newPos, color, dir, piecesToFlip );
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if ( this.isOccupied( pos ) ) return false;

  return this.constructor.DIRS.some( dir => {
    let outcome = this._positionsToFlip( pos, color, dir ).length

    return outcome;
  });
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) throw new Error( 'Invalid move!' );

  let [ x, y ] = pos
  this.grid[x][y] = new Piece( color );

  let flipPositions = this.constructor.DIRS.reduce( ( poses, dir ) => {
    return poses.concat( this._positionsToFlip( pos, color, dir ));
  }, [] );

  flipPositions.forEach( pos => this.getPiece( pos ).color = color );
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let pos, validMoves = [];
  for( let x = 0; x < 8; x++ ) {
    for( let y = 0; y < 8; y++ ) {
      pos = [ x, y ];
      if ( this.validMove( pos, color )) validMoves.push( pos );
    }
  }
  return validMoves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  let rowAxis = Array.from( {length: 8}, (_ele, i) => i );
  console.log( ' ', rowAxis.join( ' ' ) );
  let row, square;
  
  for ( let y = 0; y < 8; y++ ) {
    row =  `${y}`
    for ( let x = 0; x < 8; x++ ) {
      square = this.grid[x][y];
      square = square ? square.toString() : '_';
      row += ` ${square}`;
    }
    console.log( row );
  }
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE