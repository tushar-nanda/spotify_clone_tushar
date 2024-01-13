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

async function main()
{
    let songs = await getSongs();
    console.log(songs)
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    // console.log(songUL); 

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>${ song.replaceAll("%20", " ").replaceAll('.mp3', "")  }</li>`;
    }
    let audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener('loadeddata' , ()=>{
        // console.log(audio.duration , audio.currentSrc , audio.currentTime);
    })

}

main();