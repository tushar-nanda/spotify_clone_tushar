console.log("hi!")

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

const playMusic =(track)=>{
    currentSong.src = "/songs/"+track ;
    currentSong.play();
}
async function main()
{

    let songs = await getSongs();
    // console.log(songs)
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
    
}

main();