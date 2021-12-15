import { doc, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";

// Add a new document in collection "matches"
await setDoc(doc(db, "matches", "room_name_example"), {
  player_1: {
    player_id: 13,
    locations: {
        location_1: {
            lat: "-35.397",
            lng: "143.624"
        },
        location_2: {
            lat: "-34.397",
            lng: "150.644"
        },
        location_3: {
            lat: "-340.227",
            lng: "25.654"
        }
    },
    guesses: {
        guess_1: {
            lat: "-35.397",
            lng: "14.624"
        },
        guess_2: {
            lat: "-34.397",
            lng: "10.644"
        },
        guess_3: {
            lat: "-10.227",
            lng: "65.654"
        }
    }
  },
  player_2: {
    player_id: 27,
    locations: {
        location_1: {
            lat: "-45.397",
            lng: "14.624"
        },
        location_2: {
            lat: "-34.397",
            lng: "10.334"
        },
        location_3: {
            lat: "-33.227",
            lng: "254.654"
        }
      },
      guesses: {
          guess_1: {
              lat: "-34.667",
              lng: "13.524"
          },
          guess_2: {
              lat: "-44.397",
              lng: "12.644"
          },
          guess_3: {
              lat: "-90.227",
              lng: "64.654"
          }
      }
    }
});

const matchRef = doc(db, "matches", "room_name_example");


// Update the second player's third location with the value he selected.
await updateDoc(matchRef, {
    "player_2.locations.location_3.lat": "-191.324",
    "player_2.guesses.location_3.lng": "23.673"
});

// Update the first player's third guess field with the value he guessed.
await updateDoc(matchRef, {
    "player_1.guesses.guess_3.lat": "-192.334",
    "player_1.guesses.guess_3.lng": "21.549"
});


// Read the second player's third location selected.
console.log("The second player's third location selected is: ", matchRef.player_2.locations.location_3.lat, matchRef.player_2.locations.location_3.lng);

// Read the first player's third guess.
console.log("The first player's third guess is: ", matchRef.player_1.guesses.guess_3.lat, matchRef.player_1.guesses.guess_3.lng);


// Delete the match's document from the database.
await deleteDoc(matchRef);

// Remove the 'player_2' field from the document
await updateDoc(matchRef, {
    player_2: deleteField()
});