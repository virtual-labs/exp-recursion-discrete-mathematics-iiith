// Alert box using SweetAlert2 - https://limonte.github.io/sweetalert2
$(function() {
    var index = 0,
      algo = $(".steps").children();
    $("#next").click(function() {
      index = (index + 1) % steps.length;
      algo.eq(index).show().siblings();
    })
    $("#prev").click(function() {
      index = (index - 1) % steps.length;
      steps.eq(index).show().siblings();
    })
  })

$(function() {
    var index = 0,
      algo = $(".algo").children();
    $("#next1").click(function() {
      index = (index + 1) % algo.length;
      algo.eq(index).show().siblings();
    })
    $("#prev1").click(function() {
      index = (index - 1) % algo.length;
      algo.eq(index).show().siblings();
    })
  })
  
$(document).ready(function() {

	// Variables
	var holding = [],
		moves,
		disksNum = 3,
		minMoves = 2**disksNum - 1,
		$canves = $('#canves'),
		$restart = $canves.find('.restart'),
		$tower = $canves.find('.tower'),
		$scorePanel = $canves.find('#score-panel'),
		$movesCount = $scorePanel.find('#moves-num');

	// Init Game
	function initGame(tower) {
		$tower.html('');
		moves = 0;
		$movesCount.html(0);
		holding = [];
		for (var i = 1; i <= disksNum; i++) {
			tower.prepend($('<li class="disk disk-' + i + '" data-value="' + i + '"></li>'));
		}
		
	}

	// Game Logic
	function countMove() {
		moves++;
		$movesCount.html(moves);

		if (moves > minMoves - 1) {
            console.log(disksNum,$tower.eq(1).children().length,$tower.eq(2).children().length)
			if ($tower.eq(1).children().length === disksNum || $tower.eq(2).children().length === disksNum) {
				swal({
					allowEscapeKey: false,
					allowOutsideClick: false,
					title: 'Congratulations! You Won!',
					text: " ",
					type: 'success',
					confirmButtonColor: '#8bc34a',
					confirmButtonText: 'Play again!'
				}).then(function(isConfirm) {
					if (isConfirm) {
						initGame($tower.eq(0));
					}
				})
			}
		}
		
		
	}

	function tower(tower) {
		var $disks = tower.children(),
			$topDisk = tower.find(':last-child'),
			topDiskValue = $topDisk.data('value'),
			$holdingDisk = $canves.find('.hold');

		if ($holdingDisk.length !== 0) {
			if (topDiskValue === holding[0]) {
				$holdingDisk.removeClass('hold');
			} else if (topDiskValue === undefined || topDiskValue > holding[0]) {
				$holdingDisk.remove();
				tower.append($('<li class="disk disk-' + holding[0] + '" data-value="' + holding[0] + '"></li>'));
				countMove();
			}
		} else if ($topDisk.length !== 0) {
			$topDisk.addClass('hold');
			holding[0] = topDiskValue;
		}
	}
	
	initGame($tower.eq(0));
	
	// Event Handlers
	$canves.on('click', '.tower', function() {
		var $this = $(this);
		tower($this);
	});

});