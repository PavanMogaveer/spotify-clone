

let currentsong = new Audio();
let songs;
let currfolder;

function convertSecondsToMinutes(seconds) {

    if(isNaN(seconds)||seconds<0){
        return"00:00"
    }
    // Calculate the minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Pad single digit minutes and seconds with a leading zero
    let minutesStr = String(minutes).padStart(2, '0');
    let secondsStr = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds into MM:SS format
    return `${minutesStr}:${secondsStr}`;
}



async function getsongs(folder) {
    currfolder=folder;
    let a = await fetch(`/${folder}/`);

    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    let songul = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songul.innerHTML=""
    for (const song of songs) {
        let songinfo = song.split("-");
        let songname = songinfo[0].replaceAll("%20", "")
        let singer = songinfo[1].replaceAll("%20", "").replaceAll(".mp3", "")

        songul.innerHTML = songul.innerHTML + ` <li>
                            <img class="invert" src="assets/song.svg" alt="">
                            <div class="info">
                                <p>${songname}</p>
                                <p>${singer}</p>

                            </div>
                            <div class="song-info">${song}</div>
                            <div class="playnow">
                                <span>PlayNow</span>
                                <img src="assets/play.svg" alt="" srcset="">
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".song-info").innerHTML)
        })

    })


  
    return songs
}




const playmusic = (track,pause=false) => {

    currentsong.src = `/${currfolder}/` + track
if(!pause){
    currentsong.play()
    play.src = "/assets/pause.svg"
}
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", "").replace(".mp3", "")
    
}


async function displayAlbums() {
    let a=await fetch(`/songs/`)
    let response=await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cards = document.querySelector(".cards")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
    cards.innerHTML+=`<div data-folder="${folder}" class="card pointer">

                        <div class="play">

                            <svg width="40" height="40" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="50" fill="#0BDA51" />
                                <polygon points="40,30 70,50 40,70" fill="black" />
                            </svg>

                        </div>

                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
}

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        
        songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playmusic(songs[0])

    })
})

    }



async function main() {
    
await getsongs("songs/ncs")
    
await displayAlbums()
   
playmusic(songs[0],true)

    
    

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/assets/pause.svg"


        }
        else {
            currentsong.pause()
            play.src = "/assets/play.svg"

        }
    })


currentsong.addEventListener("timeupdate",()=>{
     document.querySelector(".song-time").innerHTML=`
   ${convertSecondsToMinutes(currentsong.currentTime)} / ${convertSecondsToMinutes(currentsong.duration)}
    `

    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
   
    if(currentsong.duration==currentsong.currentTime){
            play.src = "/assets/play.svg"
    }
    
    
})



document.querySelector(".seekbar").addEventListener("click",e=>{
    document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%";
    currentsong.currentTime=((currentsong.duration)*(e.offsetX/e.target.getBoundingClientRect().width)*100)/100;

})



document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})

document.querySelector(".clear").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-130%"
})


previous.addEventListener("click",()=>{
    
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
        playmusic(songs[index-1])
    }
})

next.addEventListener("click",()=>{
    
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index+1)<songs.length){
        playmusic(songs[index+1])
    }
})

document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
     currentsong.volume=parseInt(e.target.value)/100
     if (currentsong.volume==0){
         volume.src = "/assets/mute.svg"
     }
     else{
        volume.src = "/assets/volume.svg"
     }
     
   
})



volume.addEventListener("click", () => {
    if(currentsong.volume==0){
        volume.src = "/assets/volume.svg"
       currentsong.volume=0.5
       document.querySelector(".volume").getElementsByTagName("input")[0].value=50
    }
    else{
        currentsong.volume=0
        volume.src = "/assets/mute.svg"
        document.querySelector(".volume").getElementsByTagName("input")[0].value=0

        
    }

})


}





main()
