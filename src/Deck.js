import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import './Deck.css'
import Card from './Card.js'

const BASEURL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [deck, setDeck] = useState();
    const [drawnCards, setDrawnCards] = useState([]);
    const [isDeckEmpty, setIsDeckEmpty] = useState(false);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

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
    }, [setDeck])

    useEffect(() => {
        async function drawCard() {
            try {
                const res = await axios.get(`${BASEURL}/${deck.deck_id}/draw/`);
                if (res.data.remaining === 0) {
                    setIsDeckEmpty(true);
                    alert("There are no cards remaining!");
                    setAutoDraw(false);
                }
                setDrawnCards([...drawnCards, res.data.cards[0]])
            } catch (err) {
                alert(err)
            }
        }

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await drawCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck, drawnCards]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    return (
        <div className="Deck">
            {isDeckEmpty ? null : <button onClick={toggleAutoDraw}> {autoDraw ? "Stop" : "Start"} drawing cards!</button>}
            <div className="Deck-cardarea">
                {drawnCards.map((c) => <Card key={c.code} image={c.image} name={c.suit + c.value} />)}
            </div>
        </div>
    )
}

export default Deck;