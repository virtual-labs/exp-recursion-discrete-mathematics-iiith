// Alert box using SweetAlert2 - https://limonte.github.io/sweetalert2


var observ = document.getElementById("observations"); 
$(document).ready(function() {
  $('#MyButton').click(function(){
	//$('#dropdown-list').val();
	var diskn = $('#dropdown-list').val(); //$('#dropdown-list').val(); $("#jqxslider").jqxSlider('getValue');
	$('#dropdown-list').attr('disabled', true);
	//$('#jqxslider').jqxSlider({ disabled:true }); 

	// Variables
	var holding = [],
		moves,
		disksNum = parseInt(diskn),
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
		console.log(disksNum,$tower.eq(1).children().length,$tower.eq(2).children().length)
		if (moves > minMoves - 1) {
            console.log(disksNum,$tower.eq(1).children().length,$tower.eq(2).children().length)
			console.log($tower.eq(1).children().length, disksNum, $tower.eq(1).children().length.toString() === disksNum.toString())
			console.log($tower.eq(2).children().length, disksNum, $tower.eq(2).children().length.toString() === disksNum.toString())
			
			if ($tower.eq(1).children().length === disksNum || $tower.eq(2).children().length === disksNum) {
				console.log('Finished')
				var msg = "Try with " + (disksNum+1).toString() + " disks";
				observ.innerHTML = "<font size=4 color=green>" +
            	"<b>You have finished Tower of Hanoi</b>" +
            	"</font>" + "<br>"+
            	"<br>"+ msg;

				swal({
					allowEscapeKey: false,
					allowOutsideClick: false,
					title: 'Congratulations! You Finished.',
					text: msg,
					type: 'success',
					confirmButtonColor: '#8bc34a',
					confirmButtonText: 'Play again!'
				}).then(function(isConfirm) {
					if (isConfirm) {
						window.parent.location = window.parent.location.href;
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
});