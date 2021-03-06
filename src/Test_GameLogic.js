describe("In Havannah", function() {
	var _gameLogic;


	beforeEach(module("myApp"));

	beforeEach(inject(function (gameLogic) {
		_gameLogic = gameLogic;
	}));

	/**
	 * board initialization
	 * @param pawn:a character that represent the initial pawn that 
	 *             will be place at every position('R', 'B', or '')
	 * @return board: a two dimensional array that represent the board  
	 */
	function setBoard(){
		return _gameLogic.setBoard();
	}

	function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
		expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
			stateBeforeMove: stateBeforeMove,
			move: move})).toBe(true);
	}

	function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
		expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
			stateBeforeMove: stateBeforeMove,
			move: move})).toBe(false);
	}

	//first move
	it(" 1:placing R in 0x0 from initial state is legal", function() {
		var board = _gameLogic.setBoard();
		board[0][0] = 'R';
		console.log("oxo");
		expectMoveOk(0,{},[{setTurn: {turnIndex : 1}},
		                   {set: {key: 'board', value: board}},
		                   {set: {key: 'delta', value: {row: 0, col: 0}}}
		                   ])
	});

it(" 1:placing R in 2x9 from initial state is legal", function() {
	console.log("2x9");
		expect(_gameLogic.isMoveOk({move:[{setTurn:{turnIndex:1}},
		{set:{key:"board",value:[["","","","","","","","",undefined,undefined,undefined,undefined,undefined,undefined],
		["","","","","","","","","",undefined,undefined,undefined,undefined,undefined],
		["","","","","","","","","","R",undefined,undefined,undefined,undefined],
		["","","","","","","","","","","",undefined,undefined,undefined],
		["","","","","","","","","","","","",undefined,undefined],
		["","","","","","","","","","","","","",undefined],
		["","","","","","","","","","","","","",""],
		["","","","","","","","","","","","","","",""],
		[undefined,"","","","","","","","","","","","","",""],
		[undefined,undefined,"","","","","","","","","","","","",""],
		[undefined,undefined,undefined,"","","","","","","","","","","",""],
		[undefined,undefined,undefined,undefined,"","","","","","","","","","",""],
		[undefined,undefined,undefined,undefined,undefined,"","","","","","","","","",""],
		[undefined,undefined,undefined,undefined,undefined,undefined,"","","","","","","","",""],
		[undefined,undefined,undefined,undefined,undefined,undefined,undefined,"","","","","","","",""]]}},
		{set:{key:"delta",value:{row:2,col:9}}}],
		turnIndexBeforeMove:0,stateBeforeMove:{}})).toBe(true);
		console.log("end");
	});


it(" 1:placing R in 2x9 from initial state is legal", function() {
	var board = _gameLogic.setBoard();
		//board[2][9] = 'R';
		expect(_gameLogic.createMove(board,2,9,0)).toBe([{ setTurn : { turnIndex : 1 } }, { set : { key : 'board', value : [["","","","","","","","",undefined,undefined,undefined,undefined,undefined,undefined],
		["","","","","","","","","",undefined,undefined,undefined,undefined,undefined],
		["","","","","","","","","","R",undefined,undefined,undefined,undefined],
		["","","","","","","","","","","",undefined,undefined,undefined],
		["","","","","","","","","","","","",undefined,undefined],
		["","","","","","","","","","","","","",undefined],
		["","","","","","","","","","","","","",""],
		["","","","","","","","","","","","","","",""],
		[undefined,"","","","","","","","","","","","","",""],
		[undefined,undefined,"","","","","","","","","","","","",""],
		[undefined,undefined,undefined,"","","","","","","","","","","",""],
		[undefined,undefined,undefined,undefined,"","","","","","","","","","",""],
		[undefined,undefined,undefined,undefined,undefined,"","","","","","","","","",""],
		[undefined,undefined,undefined,undefined,undefined,undefined,"","","","","","","","",""],
		[undefined,undefined,undefined,undefined,undefined,undefined,undefined,"","","","","","","",""]]}},
		{ set : { key : 'delta', value : { row : 2, col : 9 } } } ]);
	
	});
	it(" placing B in 0x1 from initial state is legal", function() {
		var board = setBoard();
		board[0][0] = 'R';
		var nextBoard = angular.copy(board);
		nextBoard[0][1] = 'B';
		expectMoveOk(1,{board: board, delta: {row: 0, col: 0}}, 
				[{setTurn: {turnIndex : 0}},
				 {set: {key: 'board', value: nextBoard}},
				 {set: {key: 'delta', value: {row: 0, col: 1}}}
				 ])
	});


	it("placing an B in a non-empty position is illegal", function() {
		var board = setBoard();
		board[0][0] = 'R';
		var nextBoard = angular.copy(board);
		nextBoard[0][0] = 'B';
		expectIllegalMove(1,{board: board, delta: {row: 0, col: 0}}, 
				[{setTurn: {turnIndex : 0}},
				 {set: {key: 'board', value: nextBoard}},
				 {set: {key: 'delta', value: {row: 0, col: 1}}}
				 ])
	});

	
	it(" R gets a Win by forming a bridge", function() {
		var board3=_gameLogic.setBoard();
		for(i=0; i<8; ++i) {
			board3[0][i]='R';
		}

		expect(_gameLogic.getBridgeWin(board3,0,7)).toBe(true);
	});

	it(" B gets a Win by forming Fork", function() {
		var board4=_gameLogic.setBoard();
		for(i=0; i<9; ++i) {
			board4[i][1]='B';
		}
		for(i=1; i<15; ++i) {
			board4[8][i]='B';
		}

		expect(_gameLogic.getForkWin(board4,8,14)).toBe(true);
	});

	it("R gets a Win by forming a Ring", function() {
		var board5=_gameLogic.setBoard();
		for(i=1; i<4; ++i) {
			for(j=1; j<4; ++j) {
				board5[i][j]='R';
			}
		}
		board5[2][2]='';

		expect(_gameLogic.getRingWin(board5,1,1)).toBe(true);
	});

	it("Check getWinner logic by checking if R gets a Win by forming a Ring", function() {
		var board5=_gameLogic.setBoard();
		for(i=1; i<4; ++i) {
			for(j=1; j<4; ++j) {
				board5[i][j]='R';
			}
		}
		board5[2][2]='';

		expect(_gameLogic.getWinner(board5,1,1)).toBe('R');
	});


	it("Check getWinner logic by checking if B gets a Win by forming a Bridge", function() {
		var board3=_gameLogic.setBoard();
		for(i=0; i<8; ++i) {
			board3[0][i]='B';
		}

		expect(_gameLogic.getWinner(board3,0,7)).toBe('B');
	});

	it("Check getWinner logic if there is no winner", function() {
		var board=_gameLogic.setBoard();
		board[0][i]='B';
		expect(_gameLogic.getWinner(board,0,7)).toBe('');
	});

	
	
	it("Check isTie logic with tie due to full board", function() {

		var horIndex = [[0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13],[0,14],[0,15],
		                [1,15], [2, 15], [3, 15], [4, 15], [5, 15],[6,15],[7,15]];
		var board5=_gameLogic.setBoard();
		for(i=0; i<15; ++i){
			for(j=horIndex[i][0]; j<horIndex[i][1]; ++j){
				board5[i][j] = 'R';
			}
		}

		expect(_gameLogic.isTie(board5)).toBe(true);
	});

	it("Check isMoveOk logic with tie due to full board ", function() {

		 var horIndex = [[0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13],[0,14],[0,15],
			                [1,15], [2, 15], [3, 15], [4, 15], [5, 15],[6,15],[7,15]];
			var board_tie1=_gameLogic.setBoard();
			for(i=0; i<15; ++i){
				for(j=horIndex[i][0]; j<horIndex[i][1]; ++j){
					if(board_tie1[i][j]==='')board_tie1[i][j] = 'R';
					if(_gameLogic.isInsideBoard(i,j+1)){
					board_tie1[i][j+1] = 'B';
					}
							}
				

			
				board_tie1[7][0]='B';}
			board_tie1[0][0]='';
			board_tie1[0][4]='';
			board_tie1[0][4]='B';

			var board_tie2= angular.copy(board_tie1);
		board_tie2[0][0]='R';
		 expectMoveOk(0,{board:board_tie1, delta: {row: 0, col: 4}},
			      [{endMatch: {endMatchScores: [0, 0]}},
			            {set: {key: 'board', value:board_tie2}},
			            {set: {key: 'delta', value: {row: 0, col: 0}}}
			            ]);
	
			});	

	it("Check isMoveOk logic without Tie", function() {

		var horIndex = [[0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13],[0,14],[0,15],
		                [1,15], [2, 15], [3, 15], [4, 15], [5, 15],[6,15],[7,15]];
		var board5=_gameLogic.setBoard();
		for(i=0; i<15; ++i){
			for(j=horIndex[i][0]; j<horIndex[i][1]; ++j){
				board5[i][j] = 'R';
			}
		}
		board5[2][1]='';
		board5[0][1]='';
		board5[0][0]='';
		board5[0][0]='B';
		var nextBoard = angular.copy(board5);
		nextBoard[0][1] = 'R';
		 expectIllegalMove(0,{board:board5, delta: {row: 0, col: 0}},
			      [{endMatch: {endMatchScores: [0, 0]}},
			            {set: {key: 'board', value:nextBoard}},
			            {set: {key: 'delta', value: {row: 0, col: 1}}}
			            ]);
	
			});	

	it("Check isTie logic without Tie ", function() {

		var horIndex = [[0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13],[0,14],[0,15],
		                [1,15], [2, 15], [3, 15], [4, 15], [5, 15],[6,15],[7,15]];
		var board5=_gameLogic.setBoard();
		for(i=0; i<15; ++i){
			for(j=horIndex[i][0]; j<horIndex[i][1]; ++j){
				board5[i][j] = 'R';
			}
		}
		board5[2][2]='';
		expect(_gameLogic.isTie(board5)).toBe(false);
	});
	
	
	
		it("test Illegal move outside board on N-E side", function() {
		var board=_gameLogic.setBoard();
		board[0][0] = 'R';
		var nextBoard = angular.copy(board);
		nextBoard[1][14] = 'B';
		expectIllegalMove(1,{board: board, delta: {row: 0, col: 0}}, 
				[{setTurn: {turnIndex : 0}},
				 {set: {key: 'board', value: nextBoard}},
				 {set: {key: 'delta', value: {row:1, col: 14}}}
				 ])
	});
		
	
	it("test Illegal move outside board on S-W side", function() {
		var board=_gameLogic.setBoard();
		board[0][0] = 'R';
		var nextBoard = angular.copy(board);
		nextBoard[14][1] = 'B';
		expectIllegalMove(1,{board: board, delta: {row: 0, col: 0}}, 
				[{setTurn: {turnIndex : 0}},
				 {set: {key: 'board', value: nextBoard}},
				 {set: {key: 'delta', value: {row:14, col: 1}}}
				 ])
	});
	
	
	
	it("undefined move is illegal", function() {
		expectIllegalMove(0, {}, undefined);
	});

	it("move without board is illegal", function() {
		expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
	});

	it("move without delta is illegal", function() {
		var board=_gameLogic.setBoard();
		board[0][0] = 'R';
		expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
		                          {set: {key: 'board', value: board
		                          }}]);
	}); 

	it("placing R in 0x0  abd B in 1x1 but setTurn to yourself is illegal(B sets turn to itself again)", function() {
		var board=_gameLogic.setBoard();
		board[0][0] = 'R';
		var nextBoard = angular.copy(board);
		nextBoard[1][1] = 'B';
		expectIllegalMove(1,{board: board, delta: {row: 0, col: 0}}, 
				[{setTurn: {turnIndex : 1}},
				 {set: {key: 'board', value: nextBoard}},
				 {set: {key: 'delta', value: {row:1, col: 1}}}
				 ])	});
	
	it("Check MoveOk logic by checking if B gets a Win by forming a Bridge", function() {
		var board3=_gameLogic.setBoard();
		for(i=0; i<7; ++i) {
			board3[0][i]='B';
		}
		board3[2][0]='R';
		var nextBoard = angular.copy(board3);
		nextBoard[0][7] = 'B';
		 expectMoveOk(1,{board:board3, delta: {row: 2, col: 0}},
			      [{endMatch: {endMatchScores: [0, 1]}},
			            {set: {key: 'board', value:nextBoard}},
			            {set: {key: 'delta', value: {row: 0, col: 7}}}
			            ]);
	/*	expectMoveOk(1,{board: board3, delta: {row: 2, col: 0}}, 
				[{setTurn: {turnIndex : 0}},
				 {set: {key: 'board', value: nextBoard}},
				 {set: {key: 'delta', value: {row:0, col: 7}}}
				 ]);	
		
		expect(_gameLogic.isMoveOk({turnIndexBeforeMove: 1, 
	        stateBeforeMove: {endMatch: {endMatchScores:[0,1]},board: board3, delta: {row: 0, col: 0}}, 
	      move: [{setTurn: {turnIndex : 0}},
	      {set: {key: 'board', value: nextBoard}},
	      {set: {key: 'delta', value: {row: 0, col: 7}}}]})).toBe(true);
		expect(_gameLogic.createMove(board3,0,7,1)).toBe([{endMatch: {endMatchScores:[0,1]}}, {set: {key: 'board', value: nextBoard}},
	      {set: {key: 'delta', value: {row: 0, col: 7}}}]);
*/
			});

	it("Check MoveOk logic by checking if R gets a Win by forming a Ring", function() {
		var board5=_gameLogic.setBoard();
		for(i=1; i<4; ++i) {
			for(j=1; j<4; ++j) {
				board5[i][j]='R';
			}
		}
		board5[2][2]='';
		board5[1][1]='';
		board5[14][14]='B';
		var nextBoard = angular.copy(board5);
		nextBoard[1][1] = 'R';
		 expectMoveOk(0,{board:board5, delta: {row: 14, col: 14}},
			      [{endMatch: {endMatchScores: [1, 0]}},
			            {set: {key: 'board', value:nextBoard}},
			            {set: {key: 'delta', value: {row: 1, col: 1}}}
			            ]);
	
			});
	
	it("Check MoveOk logic by checking if B gets a Win by forming a Fork", function() {
		var board4=_gameLogic.setBoard();
		for(i=0; i<9; ++i) {
			board4[i][1]='B';
		}
		for(i=1; i<15; ++i) {
			board4[8][i]='B';
		}
		board4[0][1]='';
		board4[14][14]='R';
		var nextBoard = angular.copy(board4);
		nextBoard[0][1] = 'B';
		 expectMoveOk(1,{board:board4, delta: {row: 14, col: 14}},
			      [{endMatch: {endMatchScores: [0, 1]}},
			            {set: {key: 'board', value:nextBoard}},
			            {set: {key: 'delta', value: {row: 0, col: 1}}}
			            ]);
	
			});	
	
/*	
	it("should not win by forming a Fork", function() {
		var board4=_gameLogic.setBoard();
		for(i=0; i<8; ++i) {
			board4[i][0]='B';
		}
		for(i=1; i<8; ++i) {
			board4[0][i]='B';
		}
		board4[0][1]='';
		board4[14][14]='R';
		var nextBoard = angular.copy(board4);
		nextBoard[0][1] = 'B';
		 expectMoveOk(1,{board:board4, delta: {row: 14, col: 14}},
			      [{setTurn: {turnIndex : 0}},
			            {set: {key: 'board', value:nextBoard}},
			            {set: {key: 'delta', value: {row: 0, col: 1}}}
			            ]);
	
			});	

*/
})

