token = "YOUR_CLASH_ROYAL_API_KEY"
tag = "YOUR_CLASH_ROYALE_TAG"

const axios = require("axios")
const { createCanvas, loadImage} = require("canvas")
const fs = require('fs')
const parseDuration = require('parse-duration')

var dico = [0, 0, 0, 0, 0, 0, 0, 0]

const verif = async (tag1) => {

    const heure = await axios.get("https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Paris").catch(error => console.log(error));
    new_dico = []

    var data = await axios.get(`https://api.clashroyale.com/v1/players/%23${tag1}/battlelog`, {

        headers: {
            'Authorization': `Bearer ${token}`
        },

    })

    console.log(`Request send at ${heure.data.time}.`)

    const canvas = createCanvas(750, 465);
    const ctx = canvas.getContext("2d");

    let x = 0
    let y = 5
    let s = 0

    data.data[0].team[0].cards.forEach(async carte => {

        new_dico.push(`${carte.name.replace(" ", "_")}`)

    })
    new_dico.sort()

    var pareil = true

    if(new_dico[0] !== dico[0]) pareil = false
    if(new_dico[1] !== dico[1]) pareil = false
    if(new_dico[2] !== dico[2]) pareil = false
    if(new_dico[3] !== dico[3]) pareil = false
    if(new_dico[4] !== dico[4]) pareil = false
    if(new_dico[5] !== dico[5]) pareil = false
    if(new_dico[6] !== dico[6]) pareil = false
    if(new_dico[7] !== dico[7]) pareil = false

    if(pareil === false) {

        data.data[0].team[0].cards.forEach(async carte => {

            dico = new_dico
            var card = await loadImage(`${carte.iconUrls.medium}`);
            ctx.drawImage(card, x, y, card.width/1.5, card.height/1.5)
            x = x + 187
            s = s + 1

            if (s === 4) {

                y = y + 227
                x = 0

            }

            if(s === 8) {

                fs.writeFile(`deck.png`, canvas.toBuffer(), err => {

                    if (err) {

                        console.log(err)

                    }
                    else console.log(`Deck picture modified with sucess at ${heure.data.time}.`)

                 })
            }
        })
    }
}

verif(tag)

var duration = parseDuration('1m')
setInterval( async () => {

    verif(tag)

}, duration)