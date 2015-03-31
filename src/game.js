angular.module('myApp')

  .controller('Ctrl',
      ['$scope', '$rootScope','$log', '$timeout',
       'gameService', 'stateService', 'gameLogic', 'resizeGameAreaService',
      function ($scope, $rootScope, $log, $timeout,
        gameService, stateService, gameLogic, resizeGameAreaService) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(1);

 	$scope.numbersTo=      function numbersTo(start,end) {
        var res = [];
        for (var i=start; i<end; i++) {
          res[i] = i;
        }
      
        return res;
      }
 	
 	  $scope.getStyle = function (row, col) {
 	        var cell = $scope.board[row][col];
 	        if (cell === 'R') {
 	            return {
 	                "-webkit-animation": "moveAnimation 2s",
 	                "animation": "moveAnimation 2s"};
 	        }
 	        if (cell === 'B') {
 	          return {
 	              "-webkit-animation": "moveAnimation 2s",
 	              "animation": "moveAnimation 2s"};
 	        }
 	        return {}; // no style
 	      }
 	 var draggingLines = document.getElementById("draggingLines");
     var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
     var verticalDraggingLine = document.getElementById("verticalDraggingLine");
   //  var clickToDragPiece = document.getElementById("clickToDragPiece");
     var gameArea = document.getElementById("gameArea");
     
     var rowsNum = 15;
     var colsNum = 15;
     window.handleDragEvent = handleDragEvent;
     function handleDragEvent(type, clientX, clientY) {
       // Center point in gameArea
       var x = clientX - gameArea.offsetLeft;
       var y = clientY - gameArea.offsetTop;
       // Is outside gameArea?
       if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
        // clickToDragPiece.style.display = "none";
         draggingLines.style.display = "none";
         return;
       }
      // clickToDragPiece.style.display = "inline";
       draggingLines.style.display = "inline";
       // Inside gameArea. Let's find the containing square's row and col
       var col = Math.floor((colsNum * x) / gameArea.clientWidth);
       var row = Math.floor((rowsNum * y) / gameArea.clientHeight);
       var centerXY = getSquareCenterXY(row, col);
       console.log(centerXY);
       verticalDraggingLine.setAttribute("x1", centerXY.x-20);
       verticalDraggingLine.setAttribute("x2",  centerXY.x);
       horizontalDraggingLine.setAttribute("y1", centerXY.y);
       horizontalDraggingLine.setAttribute("y2", centerXY.y);
       var topLeft = getSquareTopLeft(row, col);
      // clickToDragPiece.style.left = topLeft.left + "px";
      // clickToDragPiece.style.top = topLeft.top + "px";
       if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
         // drag ended
        // clickToDragPiece.style.display = "none";
         draggingLines.style.display = "none";
         dragDone(row, col);
       }
     }
     function getSquareWidthHeight() {
    
       return {
         width : (rowsNum%2==0? ((gameArea.clientWidth / colsNum )- (colsNum * x)/2):gameArea.clientWidth / colsNum),
         height : (rowsNum%2==0? ((gameArea.clientHeight / rowsNum )- (rowsNum * y)/2):gameArea.clientHeight / rowsNum)
       };
     }
     function getSquareTopLeft(row, col) {
       var size = getSquareWidthHeight();
       return {top: row * size.height, left: col * size.width}
     }
     function getSquareCenterXY(row, col) {
       var size = getSquareWidthHeight();
       return {
         x: col * size.width + size.width / 2,
         y: row * size.height + size.height / 2
       };
     }
       function isWhiteSquare(row, col) {
         return ((row+col)%2)==0;
       }
       function getIntegersTill(number) {
         var res = [];
         for (var i = 0; i < number; i++) {
           res.push(i);
         }
         return res;
       }
//       $scope.rows = getIntegersTill(rowsNum);
//       $scope.cols = getIntegersTill(colsNum);
//       $scope.rowsNum = rowsNum;
//       $scope.colsNum = colsNum;
//      

    function sendComputerMove() {
      var possMoves = gameLogic.getPossibleMoves($scope.board,$scope.turnIndex);
      console.log('Possible Moves=',possMoves);
      var randomNo = Math.floor(Math.random()*possMoves.length);
      console.log('random move=',possMoves[randomNo]);
      gameService.makeMove(possMoves[randomNo]); 
     
      // gameService.makeMove(aiService.createComputerMove($scope.board, $scope.turnIndex,
      //     // at most 1 second for the AI to choose a move (but might be much quicker)
      //     {millisecondsLimit: 1000}));
    }

    function updateUI(params) {
      $scope.board = params.stateAfterMove.board;
      $scope.delta = params.stateAfterMove.delta;
      if ($scope.board === undefined) {
        $scope.board = gameLogic.setBoard();
      }
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;

      // Is it the computer's turn?
      if ($scope.isYourTurn &&
          params.playersInfo[params.yourPlayerIndex].playerId === '') {
        console.log('computer turn');
        $scope.isYourTurn = false; // to make sure the UI won't send another move.
        // Waiting 0.5 seconds to let the move animation finish; if we call aiService
        // then the animation is paused until the javascript finishes.
        $timeout(sendComputerMove, 500);
      }
    }
   // window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.
/*
    var width = 960,
    height = 500,
    radius = 20;

var topology = hexTopology(radius, width, height);

var projection = hexProjection(radius);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("class", "hexagon")
  .selectAll("path")
    .data(topology.objects.hexagons.geometries)
  .enter().append("path")
    .attr("d", function(d) { return path(topojson.feature(topology, d)); })
    .attr("class", function(d) { return d.fill ? "fill" : null; })
    .on("mousedown", mousedown)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

svg.append("path")
    .datum(topojson.mesh(topology, topology.objects.hexagons))
    .attr("class", "mesh")
    .attr("d", path);

var border = svg.append("path")
    .attr("class", "border")
    .call(redraw);

var mousing = 0;

function mousedown(d) {
  mousing = d.fill ? -1 : +1;
  mousemove.apply(this, arguments);
}

function mousemove(d) {
  if (mousing) {
    d3.select(this).classed("fill", d.fill = mousing > 0);
    border.call(redraw);
  }
}

function mouseup() {
  mousemove.apply(this, arguments);
  mousing = 0;
}

function redraw(border) {
  border.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
}

function hexTopology(radius, width, height) {
  var dx = radius * 2 * Math.sin(Math.PI / 3),
      dy = radius * 1.5,
      m = Math.ceil((height + radius) / dy) + 1,
      n = Math.ceil(width / dx) + 1,
      geometries = [],
      arcs = [];

  for (var j = -1; j <= m; ++j) {
    for (var i = -1; i <= n; ++i) {
      var y = j * 2, x = (i + (j & 1) / 2) * 2;
      arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
    }
  }

  for (var j = 0, q = 3; j < m; ++j, q += 6) {
    for (var i = 0; i < n; ++i, q += 3) {
      geometries.push({
        type: "Polygon",
        arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
        fill: Math.random() > i / n * 2
      });
    }
  }

  return {
    transform: {translate: [0, 0], scale: [1, 1]},
    objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
    arcs: arcs
  };
}

function hexProjection(radius) {
  var dx = radius * 2 * Math.sin(Math.PI / 3),
      dy = radius * 1.5;
  return {
    stream: function(stream) {
      return {
        point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
        lineStart: function() { stream.lineStart(); },
        lineEnd: function() { stream.lineEnd(); },
        polygonStart: function() { stream.polygonStart(); },
        polygonEnd: function() { stream.polygonEnd(); }
      };
    }
  };
}
*/
    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
        throw new Error("Throwing the error because URL has '?throwException'");
      }
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
        $scope.isYourTurn = false; // to prevent making another move
        gameService.makeMove(move);
      } catch (e) {
        $log.info(["Cell is already full in position:", row, col,e]);
        return;
      }
    };
    function dragDone(row, col) {
        $rootScope.$apply(function () {
          var msg = "Dragged to " + row + "x" + col;
          $log.info(msg);
          $scope.msg = msg;
          $scope.cellClicked(row, col);
        });
      }
   
    $scope.shouldShowImage = function (row, col) {
      var cell = $scope.board[row][col];
      return cell !== "";
    };
    $scope.isPieceR = function (row, col) {
        return $scope.board[row][col] === 'R';
      };
      $scope.isPieceB = function (row, col) {
        return $scope.board[row][col] === 'B';
      };
    $scope.getImageSrc = function (row, col) {
      var cell = $scope.board[row][col];
      return cell === "R" ? "imgs/R.png"
          : cell === "B" ? "imgs/B.gif" : "";
    };
    $scope.shouldSlowlyAppear = function (row, col) {
      return $scope.delta !== undefined &&
          $scope.delta.row === row && $scope.delta.col === col;
    };

    gameService.setGame({
      gameDeveloperEmail: "sm5119@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);