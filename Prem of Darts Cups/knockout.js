// =======================================
// PREMIERSHIP OF DARTS
// DOUBLE TROUBLE CUP
// KNOCKOUT ENGINE
// VERSION 1.0
// =======================================



let selectedKnockoutMatch = null;









// =======================================
// DISPLAY BRACKET
// =======================================


function updateKnockoutBracket(){


    const container =

    document.getElementById(
        "knockoutBracket"
    );



    if(!container){

        return;

    }




    let knockout =
    competition.knockout;





    container.innerHTML = `





    <div class="knockout-round">



    <h3>

    Semi Final 1

    </h3>




    ${createKnockoutCard(
        knockout.semiFinal1,
        "semiFinal1"
    )}



    </div>








    <div class="knockout-round">



    <h3>

    Semi Final 2

    </h3>




    ${createKnockoutCard(
        knockout.semiFinal2,
        "semiFinal2"
    )}



    </div>








    <div class="knockout-round final-round">



    <h3>

    Final

    </h3>




    ${createKnockoutCard(
        knockout.final,
        "final"
    )}




    </div>








    `;






}









// =======================================
// CREATE MATCH CARD
// =======================================


function createKnockoutCard(match,id){



    if(!match){

        return "";

    }






    let result="";





    if(
        match.winner
    ){


        result = `


        <div class="winner-display">

        🏆 ${match.winner}

        </div>


        `;


    }

    else{


        result = `


        <button

        class="knockout-result-button"

        onclick="openKnockoutResult('${id}')">


        Enter Result


        </button>


        `;


    }






    return `



    <div class="card knockout-card">


    <div class="knockout-player">

    ${match.player1 || "TBC"}

    </div>




    <div class="knockout-score">

    ${match.score1 ?? "-"}

    -

    ${match.score2 ?? "-"}

    </div>





    <div class="knockout-player">

    ${match.player2 || "TBC"}

    </div>





    ${result}



    </div>



    `;


}









// =======================================
// OPEN RESULT POPUP
// =======================================


function openKnockoutResult(id){



    selectedKnockoutMatch=id;



    let match =

    competition.knockout[id];





    const modal =

    document.getElementById(
        "knockoutModal"
    );



    const body =

    document.getElementById(
        "knockoutModalBody"
    );






    body.innerHTML = `



    <h2>

    Enter Knockout Result

    </h2>





    <h3>

    ${match.player1}

    VS

    ${match.player2}

    </h3>






    <input

    id="knockoutScore1"

    type="number"

    placeholder="Player 1 Score">






    <input

    id="knockoutScore2"

    type="number"

    placeholder="Player 2 Score">






    <button

    onclick="saveKnockoutResult()">


    Save Result


    </button>




    `;







    modal.classList.add(
        "show"
    );



}









// =======================================
// SAVE RESULT
// =======================================


function saveKnockoutResult(){



    let match =

    competition.knockout[
        selectedKnockoutMatch
    ];







    let score1 =

    Number(
        document.getElementById(
            "knockoutScore1"
        )
        .value
    );





    let score2 =

    Number(
        document.getElementById(
            "knockoutScore2"
        )
        .value
    );







    if(
        score1===score2
    ){

        alert(
            "There must be a winner"
        );

        return;

    }







    match.score1=score1;


    match.score2=score2;







    match.winner =

    score1 > score2

    ?

    match.player1

    :

    match.player2;








    updateKnockoutProgress();





    saveCompetition();





    closeKnockoutResult();





    updateKnockoutBracket();



}









// =======================================
// UPDATE NEXT ROUND
// =======================================


function updateKnockoutProgress(){


    let knockout =
    competition.knockout;



    // ===================================
    // AUTOMATIC GROUP WINNERS
    // ===================================



    if(
        competition.groups.A
        &&
        competition.groups.A.length
    ){


        let winnerA =
        getGroupWinner("A");


        if(winnerA){

            knockout.semiFinal2.player2 =
            winnerA;

        }

    }






    if(
        competition.groups.B
        &&
        competition.groups.B.length
    ){


        let winnerB =
        getGroupWinner("B");


        if(winnerB){

            knockout.semiFinal1.player1 =
            winnerB;

        }

    }







    if(
        competition.groups.C
        &&
        competition.groups.C.length
    ){


        let winnerC =
        getGroupWinner("C");


        if(winnerC){

            knockout.semiFinal2.player1 =
            winnerC;

        }

    }







    if(
        competition.groups.D
        &&
        competition.groups.D.length
    ){


        let winnerD =
        getGroupWinner("D");


        if(winnerD){

            knockout.semiFinal1.player2 =
            winnerD;

        }

    }








    // ===================================
    // MOVE SEMI FINAL WINNERS TO FINAL
    // ===================================



    if(
        knockout.semiFinal1.winner
    ){


        knockout.final.player1 =

        knockout.semiFinal1.winner;


    }







    if(
        knockout.semiFinal2.winner
    ){


        knockout.final.player2 =

        knockout.semiFinal2.winner;


    }








    // ===================================
    // FINAL CHAMPION
    // ===================================



    if(
        knockout.final.winner
    ){


        knockout.champion =

        knockout.final.winner;


    }



}








    if(
        knockout.final.winner
    ){


        knockout.champion =

        knockout.final.winner;


    }



function getGroupWinner(group){



    let players =

    [
        ...competition.groups[group]
    ];





    players.sort((a,b)=>{


        return (

            b.points-a.points

            ||

            b.legDifference-a.legDifference

            ||

            calculateAverage(b)
            -
            calculateAverage(a)

        );


    });






    if(players.length){

        return players[0].name;

    }




    return null;


}









// =======================================
// CLOSE POPUP
// =======================================


function closeKnockoutResult(){



    let modal =

    document.getElementById(
        "knockoutModal"
    );



    if(modal){


        modal.classList.remove(
            "show"
        );


    }



    selectedKnockoutMatch=null;



}