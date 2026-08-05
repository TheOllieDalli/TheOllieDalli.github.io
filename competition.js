// =======================================
// PREMIERSHIP OF DARTS
// DOUBLE TROUBLE CUP
// COMPETITION ENGINE
// VERSION 1.7
// =======================================



let currentFixtureFilter = "all";





document.addEventListener("DOMContentLoaded",()=>{


    loadCompetition();


    loadCompetitionPage();


});









// =======================================
// LOAD PAGE
// =======================================


function loadCompetitionPage(){


    displayWeeklyFixtures();


    displayGroupTables();


    displayFixtures();


    updateProgress();


    displayKnockout();


    displayStatistics();


}









// =======================================
// THIS WEEK'S GAMES
// =======================================


function displayWeeklyFixtures(){


    const container =
    document.getElementById(
        "overviewFixtures"
    );


    if(!container)return;



    container.innerHTML="";





    let today =
    new Date();



    let monday =
    new Date(today);



    monday.setDate(
        today.getDate()
        -
        (
        today.getDay()===0
        ?
        6
        :
        today.getDay()-1
        )
    );



    monday.setHours(
        0,0,0,0
    );




    let sunday =
    new Date(monday);



    sunday.setDate(
        monday.getDate()+6
    );



    sunday.setHours(
        23,59,59,999
    );






    let weeklyGames =

    competition.fixtures

    .filter(fixture=>{


        if(
            fixture.completed ||
            !fixture.date
        ){

            return false;

        }



        let date =
        new Date(
            fixture.date
        );



        return (
            date>=monday &&
            date<=sunday
        );


    })

    .sort((a,b)=>{


        return new Date(
            a.date+" "+a.time
        )

        -

        new Date(
            b.date+" "+b.time
        );


    });






    if(
        weeklyGames.length===0
    ){


        container.innerHTML = `


        <div class="card">

        No games scheduled this week

        </div>


        `;


        return;

    }





    let currentDay="";






    weeklyGames.forEach(fixture=>{


        let day =

        new Date(
            fixture.date
        )
        .toLocaleDateString(
            "en-GB",
            {

            weekday:"long",

            day:"numeric",

            month:"long"

            }

        );






        if(day!==currentDay){


            currentDay=day;



            container.innerHTML += `


            <h3 class="fixture-day-title">

            ${day}

            </h3>


            `;


        }






        container.innerHTML += `


        <div class="card fixture-card">


        <div class="fixture-group">

        GROUP ${fixture.group}

        </div>


        <div class="fixture-player">

        ${fixture.player1}

        </div>


        <div class="fixture-vs">

        VS

        </div>


        <div class="fixture-player">

        ${fixture.player2}

        </div>



        <div class="fixture-date">

        ⏰ ${fixture.time || "TBC"}

        </div>



        </div>


        `;


    });



}









// =======================================
// GROUP TABLES
// =======================================


function displayGroupTables(){


    const container =
    document.getElementById(
        "groupContainer"
    );


    if(!container)return;



    container.innerHTML="";





    Object.keys(
        competition.groups
    )
    .forEach(group=>{



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







        container.innerHTML += `



        <div class="card">


        <h3>

        Group ${group}

        </h3>


        <table>


        <tr>

        <th>Player</th>

        <th>P</th>

        <th>W</th>

        <th>L</th>

        <th>AVG</th>

        <th>PTS</th>


        </tr>



        ${players.map((player,index)=>`



        <tr class="${index===0 ? "leader-row":""}">


        <td>${player.name}</td>

        <td>${player.played}</td>

        <td>${player.wins}</td>

        <td>${player.losses}</td>

        <td>${calculateAverage(player)}</td>

        <td>${player.points}</td>


        </tr>



        `).join("")}




        </table>


        </div>



        `;



    });


}









// =======================================
// FIXTURE FILTER
// =======================================


function filterFixtures(){



    currentFixtureFilter =

    document.getElementById(
        "fixtureGroupFilter"
    )
    .value;




    displayFixtures();



}









// =======================================
// FIXTURES
// =======================================


function displayFixtures(){



    const container =
    document.getElementById(
        "fixtureContainer"
    );



    if(!container)return;



    container.innerHTML="";





    let fixtures =

    [...competition.fixtures];





    if(
        currentFixtureFilter !== "all"
    ){


        fixtures =

        fixtures.filter(
            fixture =>

            fixture.group ===
            currentFixtureFilter

        );


    }





    fixtures.sort((a,b)=>{


        return new Date(
            a.date+" "+a.time
        )

        -

        new Date(
            b.date+" "+b.time
        );


    });







    fixtures.forEach(fixture=>{



        let buttons="";





        if(
            fixture.completed
        ){



            buttons += `


            <button onclick="openResult(${fixture.id})">

            Edit Result

            </button>



            <button
            class="delete-button"
            onclick="removeResult(${fixture.id})">

            Remove Result

            </button>



            `;


        }

        else{


            buttons += `


            <button
            class="result-button"
            onclick="openResult(${fixture.id})">

            Enter Result

            </button>



            `;


        }






        buttons += `


        <button
        class="fixture-edit-button"
        onclick="openFixtureEditor(${fixture.id})">


        Edit Fixture


        </button>


        `;







        container.innerHTML += `



        <div class="card fixture-card">


        <div class="fixture-group">

        GROUP ${fixture.group}

        </div>



        <div class="fixture-player">

        ${fixture.player1}

        </div>




        <div class="fixture-vs">

        VS

        </div>




        <div class="fixture-player">

        ${fixture.player2}

        </div>




        <div class="fixture-date">


        📅 ${formatDate(fixture.date)}

        <br>

        ⏰ ${fixture.time || "TBC"}

        </div>




        ${buttons}



        </div>


        `;



    });



}









// =======================================
// PROGRESS
// =======================================


function updateProgress(){


    let total =
    competition.fixtures.length;



    let completed =

    competition.fixtures.filter(
        f=>f.completed
    )
    .length;



    let percentage =

    total===0
    ?
    0
    :
    completed /
    total *
    100;





    document
    .querySelectorAll(
        ".progress-fill"
    )
    .forEach(bar=>{


        bar.style.width =
        percentage+"%";


    });



}









// =======================================
// KNOCKOUT
// =======================================


function displayKnockout(){


    if(
        typeof updateKnockoutBracket
        ===
        "function"
    ){


        updateKnockoutBracket();


    }


}









// =======================================
// REFRESH
// =======================================


function refreshCompetition(){


    displayWeeklyFixtures();


    displayGroupTables();


    displayFixtures();


    updateProgress();


    displayKnockout();


}









// =======================================
// TABS
// =======================================


function showTab(tab,button){



    document
    .querySelectorAll(
        ".tab-section"
    )
    .forEach(section=>{


        section.style.display="none";


    });




    document
    .getElementById(tab)
    .style.display="block";





    document
    .querySelectorAll(
        ".competition-tabs button"
    )
    .forEach(btn=>{


        btn.classList.remove(
            "active"
        );


    });





    button.classList.add(
        "active"
    );


}









// =======================================
// HELPERS
// =======================================


function calculateAverage(player){


    if(
        !player.averages ||
        player.averages.length===0
    ){

        return "-";

    }



    let total =

    player.averages.reduce(
        (a,b)=>a+b,
        0
    );




    return (

        total /
        player.averages.length

    )
    .toFixed(2);



}






function formatDate(date){


    if(!date)return "TBC";



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

// =======================================
// STATISTICS
// =======================================


function displayStatistics(){



    const highestAverage =
    document.getElementById(
        "highestAverage"
    );


    const mostLegs =
    document.getElementById(
        "mostLegs"
    );


    const tournamentLeader =
    document.getElementById(
        "tournamentLeader"
    );


    const rankings =
    document.getElementById(
        "playerRankings"
    );




    if(!highestAverage){

        return;

    }






    let players=[];







    Object.keys(
        competition.groups
    )
    .forEach(group=>{


        competition.groups[group]
        .forEach(player=>{


            players.push(player);


        });


    });







    if(players.length===0){

        return;

    }







    // ==============================
    // HIGHEST AVERAGE
    // ==============================



    let averageWinner =

    [...players]

    .sort((a,b)=>{


        return calculateAverage(b)
        -
        calculateAverage(a);


    })[0];







    highestAverage.innerHTML = `


    <h2>

    ${averageWinner.name}

    </h2>


    <p>

    ${calculateAverage(averageWinner)}
    AVG

    </p>


    `;








    // ==============================
    // MOST LEGS WON
    // ==============================



    let legs = {};






    players.forEach(player=>{


        legs[player.name]=0;


    });








    competition.fixtures

    .filter(
        fixture =>
        fixture.completed
    )

    .forEach(fixture=>{



        if(
            fixture.result
        ){



            legs[fixture.player1] +=

            Number(
                fixture.result.score1
            );



            legs[fixture.player2] +=

            Number(
                fixture.result.score2
            );


        }



    });







    let topLegPlayer =

    Object.keys(legs)

    .sort(
        (a,b)=>

        legs[b]-legs[a]

    )[0];







    mostLegs.innerHTML = `


    <h2>

    ${topLegPlayer}

    </h2>


    <p>

    ${legs[topLegPlayer]}

    Legs Won

    </p>


    `;









    // ==============================
    // TOURNAMENT LEADER
    // ==============================



    let leader =

    [...players]

    .sort((a,b)=>{


        return (

        b.points-a.points

        ||

        legs[b.name]
        -
        legs[a.name]

        );

    })[0];







    tournamentLeader.innerHTML = `


    <h2>

    ${leader.name}

    </h2>


    <p>

    ${leader.points}

    Points

    </p>


    `;









    // ==============================
    // PLAYER RANKINGS
    // ==============================



    players.sort((a,b)=>{


        return (

        b.points-a.points

        ||

        legs[b.name]
        -
        legs[a.name]

        ||

        calculateAverage(b)
        -
        calculateAverage(a)

        );


    });






    rankings.innerHTML="";







    players.forEach((player,index)=>{



        rankings.innerHTML += `



        <div class="ranking-row">


        <strong>

        ${index+1}.

        ${player.name}

        </strong>



        <span>

        ${player.points} PTS

        |

        ${legs[player.name]} Legs

        |

        ${calculateAverage(player)} AVG


        </span>



        </div>



        `;



    });



}