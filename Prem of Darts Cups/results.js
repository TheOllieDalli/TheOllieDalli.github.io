// =======================================
// PREMIERSHIP OF DARTS
// DOUBLE TROUBLE CUP
// RESULT SYSTEM
// VERSION 1.1
// =======================================


let selectedFixture = null;





// =======================================
// OPEN RESULT MODAL
// =======================================

function openResult(fixtureId){


    selectedFixture =
    competition.fixtures.find(
        fixture => fixture.id === fixtureId
    );



    const modal =
    document.getElementById("resultModal");



    const body =
    document.getElementById("resultModalBody");



    if(!modal || !body){

        console.error(
        "Result modal missing from page"
        );

        return;

    }




    let score1 = "";

    let score2 = "";

    let avg1 = "";

    let avg2 = "";




    if(selectedFixture.completed){


        score1 =
        selectedFixture.result.score1;


        score2 =
        selectedFixture.result.score2;


        avg1 =
        selectedFixture.result.average1;


        avg2 =
        selectedFixture.result.average2;


    }







    body.innerHTML = `


    <h2>

    ${selectedFixture.player1}

    VS

    ${selectedFixture.player2}

    </h2>




    <label>

    ${selectedFixture.player1} Score

    </label>


    <input 
    id="score1"
    type="number"
    min="0"
    max="2"
    value="${score1}">





    <label>

    ${selectedFixture.player2} Score

    </label>


    <input 
    id="score2"
    type="number"
    min="0"
    max="2"
    value="${score2}">





    <label>

    ${selectedFixture.player1} Average

    </label>


    <input 
    id="average1"
    type="number"
    step="0.01"
    value="${avg1}">





    <label>

    ${selectedFixture.player2} Average

    </label>


    <input 
    id="average2"
    type="number"
    step="0.01"
    value="${avg2}">





    <button onclick="saveResult()">

    Save Result

    </button>



    `;



    modal.classList.add("show");


}








// =======================================
// SAVE RESULT
// =======================================

function saveResult(){



    let score1 =
    Number(
        document.getElementById("score1").value
    );



    let score2 =
    Number(
        document.getElementById("score2").value
    );





    if(!validBO3(score1,score2)){


        alert(
        "Invalid score. Matches must finish 2-0 or 2-1."
        );


        return;

    }






    let avg1 =
    Number(
        document.getElementById("average1").value
    )
    .toFixed(2);




    let avg2 =
    Number(
        document.getElementById("average2").value
    )
    .toFixed(2);







    selectedFixture.completed=true;



    selectedFixture.result={


        score1:score1,


        score2:score2,


        average1:avg1,


        average2:avg2


    };





    updatePlayerStats();



    saveCompetition();



    closeResult();



    refreshCompetition();



}









// =======================================
// SCORE VALIDATION
// =======================================

function validBO3(a,b){


    return (

        (a===2 && b===0)

        ||

        (a===2 && b===1)

        ||

        (a===0 && b===2)

        ||

        (a===1 && b===2)

    );


}









// =======================================
// REMOVE RESULT
// =======================================

function removeResult(id){



    if(
        !confirm(
        "Remove this result?"
        )
    ){

        return;

    }





    let fixture =
    competition.fixtures.find(
        f=>f.id===id
    );



    fixture.completed=false;



    fixture.result=null;



    updatePlayerStats();



    saveCompetition();



    refreshCompetition();



}








// =======================================
// UPDATE PLAYER STATS
// =======================================

function updatePlayerStats(){


    resetStats();





    competition.fixtures.forEach(
        fixture=>{


        if(!fixture.completed)
        return;





        let player1 =
        findPlayer(
            fixture.player1
        );



        let player2 =
        findPlayer(
            fixture.player2
        );






        player1.played++;

        player2.played++;






        player1.averages.push(
            Number(
            fixture.result.average1
            )
        );



        player2.averages.push(
            Number(
            fixture.result.average2
            )
        );







        if(
            fixture.result.score1 >
            fixture.result.score2
        ){



            player1.wins++;

            player1.points+=3;

            player2.losses++;


        }

        else{


            player2.wins++;

            player2.points+=3;

            player1.losses++;


        }



    });


}









function resetStats(){


    Object.values(
        competition.groups
    )
    .flat()
    .forEach(player=>{


        player.played=0;

        player.wins=0;

        player.losses=0;

        player.points=0;

        player.legDifference=0;

        player.averages=[];


    });


}









function findPlayer(name){


    return Object.values(
        competition.groups
    )
    .flat()
    .find(
        player =>
        player.name===name
    );


}









// =======================================
// CLOSE MODAL
// =======================================

function closeResult(){


    document
    .getElementById("resultModal")
    .classList.remove("show");


}