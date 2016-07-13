(function() {
    var doc = document;
    var songTitle = doc.querySelector('#songTitle');
    var index = 0;

    var itemsList={};

    function loadItemsList(){
      itemsList = doc.querySelectorAll("ul li");
    }

    var tracks = [{
        "track": 1,
        "name": "A"
    }, {
        "track": 2,
        "name": "B"
    }, {
        "track": 3,
        "name": "C"
    }, {
        "track": 4,
        "name": "D"
    }, {
        "track": 5,
        "name": "E"
    }, {
        "track": 6,
        "name": "F"
    }, {
        "track": 7,
        "name": "G"
    }];

    var trackCount = tracks.length;
    var btnNext = doc.querySelector('#btnNext');
    var btnPrev = doc.querySelector('#btnPrev');

    btnNext.addEventListener('click', function(e) {
        playNext(++index);
    })

    btnPrev.addEventListener('click', function(e) {
        playPrev(--index);
    })

    function playNext(i) {
        itemsList[index-1].classList.remove("activeListItem");
        if (endOfList(index)) {
            playIndex(index);
            setStyleListItem(index);
        } else {
            index = 0;
            playIndex(index);
            setStyleListItem(index);
        }
    }

    function playIndex(i) {
        audio.src = '../music/' + tracks[i].name + '.mp3';
        audio.autoplay = true;
        songTitle.innerHTML = tracks[i].name;
    }

    function playPrev(i) {
        itemsList[index + 1].classList.remove("activeListItem");
        if (beginOfList(index)) {
            playIndex(index);
            setStyleListItem(index);
        } else {
            index = trackCount - 1;
            playIndex(index);
            setStyleListItem(index);
        }
    }

    function endOfList(i) {
        return (i != (trackCount))
    }

    function beginOfList(i) {
        return (i != (-1))
    }

    window.addEventListener('load', function(e) {
        for (i in tracks) {
            var listItem = doc.createElement("li")
            listItem.setAttribute("id", tracks[i].track);
            listItem.appendChild(doc.createTextNode(tracks[i].name));
            var list = doc.querySelector("#list").appendChild(listItem);
        }
        loadItemsList();
        setStyleListItem(0);

        var selectListItem = function() {
            [].map.call(itemsList, function(e) {
                e.classList.remove("activeListItem")
            });

            this.classList.add('activeListItem');
            index = parseInt(this.getAttribute('id')) - 1;
            var curentIndex = parseInt(this.getAttribute('id'));
            playIndex(curentIndex - 1);
        };
        [].map.call(itemsList, function(e) {
            e.addEventListener("click", selectListItem, false);
        });
    });

    function setStyleListItem(i) {
        itemsList[i].classList.add("activeListItem");
        songTitle.innerHTML = tracks[i].name;
    }

    var canvas = doc.querySelector('#canvas1');
    var ctx = canvas.getContext('2d');
    canvas.width = doc.body.clientWidth / 2.7;

    const CANVAS_HEIGHT = canvas.height;
    const CANVAS_WIDTH = canvas.getAttribute("width");

    window.audio = new Audio();
    playIndex(0);

    audio.controls = true;

    audio.addEventListener('ended', function(e) {
        playNext(++index);
    });

    doc.querySelector('#myaudio').appendChild(audio);

    if (!window.AudioContext) {
        alert("Web Audio isn't available in your browser. But...you can still play the HTML5 audio :)");
        doc.querySelector('#myaudio').classList.toggle('show');
        doc.querySelector('aside').style.marginTop = '7em';
        return;
    }

    var context = new AudioContext();
    var analyser = context.createAnalyser();

    function rafCallback(time) {
        window.requestAnimationFrame(rafCallback, canvas);

        var freqByteData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqByteData); //analyser.getByteTimeDomainData(freqByteData);

        var SPACER_WIDTH = 10;
        var BAR_WIDTH = 5;
        var OFFSET = 100;
        var CUTOFF = 23;
        var numBars = Math.round(CANVAS_WIDTH / SPACER_WIDTH);

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#F6D565';
        ctx.lineCap = 'round';

        for (var i = 0; i < numBars; ++i) {
            var magnitude = freqByteData[i + OFFSET];
            ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -magnitude);
        }
    }

    function onLoad(e) {
        var source = context.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(context.destination);

        rafCallback();
    }

    window.addEventListener('load', onLoad, false);

})();
