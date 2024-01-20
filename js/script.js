console.log("hi!");
let songs;
let currFolder;
async function getSongs(folder) {
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  currFolder = folder;
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as);

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // console.log(songs)

  playMusic(songs[0], true);
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  // console.log(songUL);

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      ` <li>
        <img class="invert"  src="img/music.svg" alt="">
        <div class="info">
            <div><h5>  ${song.replaceAll("%20", " ")}</h5></div>
            <div><h6>Tushar Nanda</h6></div>
        </div>
        <div class="playnow">
            <span>playnow</span>
            <img class="invert" src="img/play.svg" alt="">
        </div>
    </li>
    `;
  }
  let audio = new Audio(songs[0]);

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      const songTitle = e.querySelector(".info h5").textContent.trim();
      playMusic(songTitle.replaceAll(" ", "%20"));
    });
  });
  return songs;
}
let currentSong = new Audio();

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums() {
  let a = await fetch("http://127.0.0.1:5500/songs");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/songs/")[1];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      cardContainer = document.querySelector(".cardContainer");
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}"class="card">
            <div class="play">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#000"
                  d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <img
              src="/songs/${folder}/cover.JPEG";
              alt=""
            />
            <h4>${response.title}</h4>
            <p>${response.description}</p>
          </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("songs/cs");
  // console.log(songs)
  play.src = "img/play.svg";

  await displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  //timeupdate
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX * 100) / e.target.getBoundingClientRect().width;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (percent * currentSong.duration) / 100;
  });

  //hambuger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  //close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  //previous song
  // Add an event listener to previous
  previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})


  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})
  //range of volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        if(e.target.src.includes("img/volume.svg" ))
        {
            e.target.src = e.target.src.replace( "img/volume.svg", "img/mute.svg");
            currentSong.volume = 0;
            document
            .querySelector(".range")
            .getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src  = e.target.src.replace( "img/mute.svg","img/volume.svg");
            e.target.src = "img/volume.svg";
            document
            .querySelector(".range")
            .getElementsByTagName("input")[0].value = 20;
            currentSong.volume = 0.2;
            
        }
    })
}

main();
