// =====================================
// PREMIERSHIP OF DARTS
// DOUBLE TROUBLE CUP ENGINE
// COMPLETE VERSION
// PART 1/2
// =====================================


let activeFixture = null;





document.addEventListener("DOMContentLoaded", function(){


    recalculateTables();

    displayGroups();

    displayFixtures();

    displayNextFixture();

    generateKnockoutBracket();


});









// =====================================
// PAGE NAVIGATION
// =====================================


function showSection(section){


    document
    .querySelectorAll(".page-section")
    .forEach(function(page){


        page.classList.add("hidden");


    });



    document
    .getElementById(section)
    .classList.remove("hidden");


}









// =====================================
// GROUP TABLES
// =====================================


function displayGroups(){


    let container =
    document.getElementById("groupContainer");


    if(!container)return;


    container.innerHTML="";



    for(let group in competition.groups){



        let players =
        [...competition.groups[group]];



        players.sort(function(a,b){


            return (

                b.points-a.points ||

                b.legDifference-a.legDifference ||

                calculateAverage(b)-calculateAverage(a)

            );


        });





        let html = `


        <div class="group-card">


        <h2>
        🎯 Group ${group}
        </h2>



        <table>


        <tr>

        <th>Player</th>

        <th>P</th>

        <th>W</th>

        <th>L</th>

        <th>PTS</th>

        <th>AVG</th>


        </tr>



        `;






        players.forEach(function(player){


            html += `


            <tr>


            <td>${player.name}</td>


            <td>${player.played}</td>


            <td>${player.wins}</td>


            <td>${player.losses}</td>


            <td>${player.points}</td>


            <td>${calculateAverage(player)}</td>


            </tr>


            `;



        });






        html += `


        </table>


        </div>


        `;



        container.innerHTML += html;



    }


}









// =====================================
// FIXTURES
// =====================================


function displayFixtures(filter="ALL"){



    let container =
    document.getElementById("fixtureContainer");



    if(!container)return;



    container.innerHTML="";



    let fixtures =
    competition.fixtures;



    if(filter !== "ALL"){


        fixtures =
        fixtures.filter(function(fixture){


            return fixture.group === filter;


        });



    }





    fixtures.forEach(function(fixture,index){



        let html = `


        <div class="fixture-card">


        <h3>
        🎯 GROUP ${fixture.group}
        </h3>


        <h2>

        ${fixture.player1}

        VS

        ${fixture.player2}

        </h2>


        <p>
        📅 ${formatDate(fixture.date)}
        </p>


        <p>
        ⏰ ${fixture.time}
        </p>


        `;




        if(fixture.completed){


            html += `


            <div class="completed-result">


            <h3>
            ${fixture.result.score1}
            -
            ${fixture.result.score2}
            </h3>


            <p>

            ${fixture.player1} AVG:
            ${fixture.result.avg1}

            </p>


            <p>

            ${fixture.player2} AVG:
            ${fixture.result.avg2}

            </p>



            </div>




            <div class="action-buttons">


            <button class="btn btn-edit"

            onclick="editResult(${index})">

            ✏️ Edit Result

            </button>




            <button class="btn btn-remove"

            onclick="removeResult(${index})">

            🗑 Remove Result

            </button>



            </div>



            `;



        }

        else{


            html += `


            <button class="btn btn-result"

            onclick="openResult(${index})">

            🎯 Enter Result

            </button>



            `;



        }






        html += `



        <br><br>



        <button class="btn btn-edit"

        onclick="editFixture(${index})">

        ✏️ Edit Fixture

        </button>



        </div>



        `;




        container.innerHTML += html;



    });



}








function filterFixtures(){


    let value =
    document.getElementById("groupFilter").value;



    displayFixtures(value);



}








// =====================================
// FIXTURE EDITING
// =====================================


function editFixture(index){


    let fixture =
    competition.fixtures[index];



    let date =
    prompt(
        "Enter date YYYY-MM-DD",
        fixture.date
    );



    let time =
    prompt(
        "Enter time",
        fixture.time
    );



    if(date){

        fixture.date=date;

    }



    if(time){

        fixture.time=time;

    }




    displayFixtures();

    displayNextFixture();


}
// =====================================
// RESULT SYSTEM
// =====================================


function openResult(index){


    activeFixture=index;


    let modal =
    document.getElementById("resultModal");


    let form =
    document.getElementById("resultForm");



    let fixture =
    competition.fixtures[index];



    form.innerHTML = `


    <label>
    ${fixture.player1} Score
    </label>


    <input id="score1" type="number" min="0" max="2">


    <label>
    ${fixture.player2} Score
    </label>


    <input id="score2" type="number" min="0" max="2">


    <label>
    ${fixture.player1} Average
    </label>


    <input id="avg1" type="number" step="0.01">


    <label>
    ${fixture.player2} Average
    </label>


    <input id="avg2" type="number" step="0.01">



    <br><br>


    <button class="btn btn-save"

    onclick="saveResult()">

    Save Result

    </button>


    `;



    modal.classList.remove("hidden");


}








function closeResultModal(){


    document
    .getElementById("resultModal")
    .classList.add("hidden");


}








function saveResult(){


    let fixture =
    competition.fixtures[activeFixture];



    let score1 =
    Number(document.getElementById("score1").value);



    let score2 =
    Number(document.getElementById("score2").value);



    if(
        !(
        (score1===2 && score2===0) ||
        (score1===2 && score2===1) ||
        (score2===2 && score1===0) ||
        (score2===2 && score1===1)
        )
    ){


        alert(
        "Only BO3 scores allowed: 2-0 or 2-1"
        );


        return;


    }






    fixture.completed=true;



    fixture.result={


        score1:score1,


        score2:score2,


        avg1:Number(
            document.getElementById("avg1").value
        ).toFixed(2),



        avg2:Number(
            document.getElementById("avg2").value
        ).toFixed(2)



    };





    closeResultModal();


    recalculateTables();


    refreshAll();



}









function editResult(index){


    openResult(index);



}








function removeResult(index){



    if(
        !confirm(
        "Remove this result?"
        )
    ) return;




    competition.fixtures[index].completed=false;


    competition.fixtures[index].result=null;



    recalculateTables();


    refreshAll();


}









// =====================================
// TABLE CALCULATIONS
// =====================================


function recalculateTables(){



    for(let group in competition.groups){



        competition.groups[group]
        .forEach(function(player){



            player.played=0;

            player.wins=0;

            player.losses=0;

            player.points=0;

            player.legDifference=0;

            player.averages=[];



        });



    }





    competition.fixtures
    .forEach(function(fixture){



        if(!fixture.completed)return;



        let player1 =
        findPlayer(fixture.player1);



        let player2 =
        findPlayer(fixture.player2);





        player1.played++;

        player2.played++;





        player1.averages.push(
            Number(fixture.result.avg1)
        );



        player2.averages.push(
            Number(fixture.result.avg2)
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






        player1.legDifference +=
        fixture.result.score1 -
        fixture.result.score2;



        player2.legDifference +=
        fixture.result.score2 -
        fixture.result.score1;



    });



}









function findPlayer(name){



    for(let group in competition.groups){


        let player =
        competition.groups[group]
        .find(function(p){


            return p.name===name;


        });



        if(player)return player;


    }



}









// =====================================
// NEXT FIXTURE
// =====================================


function displayNextFixture(){



    let box =
    document.getElementById("nextFixture");



    if(!box)return;




    let fixtures =
    competition.fixtures
    .filter(function(f){


        return !f.completed;


    });





    fixtures.sort(function(a,b){


        return new Date(a.date)
        -
        new Date(b.date);


    });





    if(fixtures.length===0){


        box.innerHTML=
        "<h2>Competition Complete</h2>";


        return;


    }






    let next =
    fixtures[0];





    box.innerHTML = `


    <h2>
    🔥 Next Fixture
    </h2>


    <h3>

    ${next.player1}

    VS

    ${next.player2}

    </h3>



    <p>
    🎯 Group ${next.group}
    </p>


    <p>
    📅 ${formatDate(next.date)}
    </p>


    <p>
    ⏰ ${next.time}
    </p>


    `;



}









// =====================================
// KNOCKOUT BRACKET
// =====================================


function generateKnockoutBracket(){



    let container =
    document.getElementById(
        "knockoutBracket"
    );



    if(!container)return;



    let A =
    getGroupWinner("A");


    let B =
    getGroupWinner("B");


    let C =
    getGroupWinner("C");


    let D =
    getGroupWinner("D");





    container.innerHTML = `



    <div class="knockout-stage">


    <div class="semi-final">



    <div class="knockout-card">


    <h3>
    Semi Final 1
    </h3>


    <p>
    Group B Winner
    </p>


    <strong>
    ${B}
    </strong>


    <hr>


    <p>
    Group D Winner
    </p>


    <strong>
    ${D}
    </strong>



    </div>






    <div class="knockout-card">


    <h3>
    Semi Final 2
    </h3>


    <p>
    Group C Winner
    </p>


    <strong>
    ${C}
    </strong>


    <hr>


    <p>
    Group A Winner
    </p>


    <strong>
    ${A}
    </strong>



    </div>



    </div>






    <div class="final-card">


    <h2>
    🏆 FINAL
    </h2>


    <p>
    Winner Semi Final 1
    </p>


    <h3>
    VS
    </h3>


    <p>
    Winner Semi Final 2
    </p>


    </div>



    </div>



    `;



}








function getGroupWinner(group){



    let players =
    [...competition.groups[group]];



    players.sort(function(a,b){



        return (

        b.points-a.points ||

        b.legDifference-a.legDifference ||

        calculateAverage(b)-calculateAverage(a)

        );


    });




    return players[0]
    ?
    players[0].name
    :
    "TBC";



}









// =====================================
// HELPERS
// =====================================


function calculateAverage(player){


    if(
    player.averages.length===0
    )
    return "-";



    let total =
    player.averages
    .reduce(function(a,b){

        return a+b;

    },0);




    return (
        total /
        player.averages.length
    ).toFixed(2);



}





function formatDate(date){



    return new Date(date)
    .toLocaleDateString(
        "en-GB",
        {

        day:"numeric",

        month:"long",

        year:"numeric"

        }
    );


}








function refreshAll(){


    displayGroups();


    displayFixtures(
        document.getElementById("groupFilter")
        ?
        document.getElementById("groupFilter").value
        :
        "ALL"
    );


    displayNextFixture();


    generateKnockoutBracket();


}