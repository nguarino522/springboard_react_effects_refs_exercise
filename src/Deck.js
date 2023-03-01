import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Deck.css'
import Card from './Card.js'

const BASEURL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [deck, setDeck] = useState();
    const [drawnCards, setDrawnCards] = useState([]);
    const [isDeckEmpty, setIsDeckEmpty] = useState(false);

    useEffect(() => {
        async function getDeck() {
            try {
                const res = await axios.get(`${BASEURL}/new/shuffle/`);
                setDeck(res.data);
            } catch (err) {
                alert(err)
            }
        }
        getDeck();
    }, [])

    // useEffect(() => {
    //     async function drawCard() {
    //         const res = await axios.get(`${BASEURL}/${deck.deck_id}/draw/`);

    //     }
    // })

    async function drawCard() {
        try {
            const res = await axios.get(`${BASEURL}/${deck.deck_id}/draw/`);
            if (res.data.remaining === 0) setIsDeckEmpty(true);
            setDrawnCards([...drawnCards, res.data.cards[0]])
        } catch (err) {
            alert(err)
        }
    }

    return (
        <div className="Deck">
             { isDeckEmpty ? null : <button onClick={drawCard}>Draw A Card!</button> }
            <div className="Deck-cardarea">
                {drawnCards.map((c) => <Card key={c.code} image={c.image} name={c.suit + c.value} />)}
            </div>
        </div>
    )
}

export default Deck;