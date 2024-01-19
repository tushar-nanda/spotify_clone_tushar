console.log("hi!")
let songs;
async function getSongs()
{
    let a = await fetch("http://127.0.0.1:5500/songs/");
    
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    // console.log(as);
    
    let songs = [] ;
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith('.mp3'))    
        {
            songs.push(element.href.split('/songs/')[1]);
        }    
    }
    // console.log(songs)
    
    return songs;
    
}
let currentSong = new Audio();

const playMusic =(track,pause = false)=>{
    currentSong.src = "/songs/"+track ;
    if(!pause)
    {
        currentSong.play();
        play.src = 'pause.svg';

    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20" , " ");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }
async function main()
{

    songs = await getSongs();
    // console.log(songs)
    play.src = 'play.svg';

    playMusic(songs[0] , true);
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    // console.log(songUL); 

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
        <img class="invert"  src="music.svg" alt="">
        <div class="info">
            <div><h5>  ${song.replaceAll("%20", " ")}</h5></div>
            <div><h6>Tushar Nanda</h6></div>
        </div>
        <div class="playnow">
            <span>playnow</span>
            <img class="invert" src="play.svg" alt="">
        </div>
    </li>
    `;
    }
    let audio = new Audio(songs[0]);
  

    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click" ,element=>{
            const songTitle = e.querySelector('.info h5').textContent.trim();
            playMusic(songTitle.replaceAll(' ','%20'));

        })

    });

    play.addEventListener('click',()=>{
        if(currentSong.paused)
        {
            currentSong.play();
            play.src = 'pause.svg';
        }
        else
        {currentSong.pause();
        play.src= 'play.svg';}
    })

    //timeupdate
    currentSong.addEventListener("timeupdate", () => {
       
        document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration)*100+"%"; 
    });
    document.querySelector('.seekbar').addEventListener("click" , (e)=>{
        let percent = e.offsetX*100 / (e.target.getBoundingClientRect().width) ;
        document.querySelector('.circle').style.left =percent +'%';
        currentSong.currentTime =  (percent*currentSong.duration )/100;
    })

    //hambuger
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = 0;
    })

    //close button
    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-120%";
    })
    //previous song

    previous.addEventListener("click",()=>{
        let ff = currentSong.src.split('/songs/')[1];
        var idx = songs.indexOf(ff);
        idx = (idx-1+songs.length)%songs.length;
        playMusic(songs[idx]);
    })
    next.addEventListener("click",()=>{
        let ff = currentSong.src.split('/songs/')[1];
        var idx = songs.indexOf(ff);
        idx = (idx+1)%songs.length;
        playMusic(songs[idx]);
    })

    //range of volume
    document.querySelector('.range').getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e);
        currentSong.volume = parseInt(e.target.value) / 100 ;
    });
    
      
}

main();