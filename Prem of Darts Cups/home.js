// =======================================
// PREMIERSHIP OF DARTS
// HOMEPAGE SYSTEM
// VERSION 1.2
// =======================================


document.addEventListener("DOMContentLoaded", () => {


    loadCompetition();


    loadHomepage();


});







// =======================================
// LOAD HOMEPAGE
// =======================================


function loadHomepage(){


    displayNextFixtures();


    displayGroupLeaders();


    displayProgress();


}









// =======================================
// NEXT FIXTURES
// =======================================


function displayNextFixtures(){



    const next =
    document.getElementById(
        "nextFixture"
    );


    const following =
    document.getElementById(
        "followingFixture"
    );



    if(!next || !following){

        return;

    }





    let fixtures =

    competition.fixtures

    .filter(
        fixture =>
        !fixture.completed
    )

    .sort(
        (a,b)=>

        new Date(
            a.date + " " + a.time
        )

        -

        new Date(
            b.date + " " + b.time
        )

    );






    if(fixtures.length===0){


        next.innerHTML =
        `
        🏆 Competition Complete
        `;


        following.innerHTML="";


        return;


    }






    next.innerHTML =
    createFixtureHTML(
        fixtures[0]
    );






    if(fixtures[1]){


        following.innerHTML =
        createFixtureHTML(
            fixtures[1]
        );


    }

    else{


        following.innerHTML =
        "No upcoming fixtures";


    }



}









function createFixtureHTML(fixture){



    return `



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

    ⏰ ${fixture.time}

    </div>



    `;


}









// =======================================
// GROUP LEADERS
// =======================================


function displayGroupLeaders(){



    const container =
    document.getElementById(
        "leadersGrid"
    );



    if(!container){

        return;

    }





    container.innerHTML="";





    Object.keys(
        competition.groups
    )
    .forEach(group=>{





        let players =

        [
            ...competition.groups[group]
        ];





        players.sort(
            (a,b)=>{


            return (

            b.points-a.points

            ||

            b.legDifference-a.legDifference

            ||

            calculateAverage(b)
            -
            calculateAverage(a)

            );


            }

        );





        let leader =
        players[0];





        container.innerHTML += `


        <div class="leader-card">


        <h3>

        Group ${group}

        </h3>



        <div class="leader-name">

        ${leader.name}

        </div>


        </div>



        `;





    });



}









// =======================================
// PROGRESS
// =======================================


function displayProgress(){



    const banner =
    document.querySelector(
        ".competition-banner"
    );



    if(!banner){

        return;

    }




    let total =
    competition.fixtures.length;



    let completed =

    competition.fixtures.filter(

        fixture =>
        fixture.completed

    ).length;




    let percentage =
    total===0
    ?
    0
    :
    (
        completed /
        total
    )
    *
    100;





    let progress =

    document.querySelector(
        ".progress-fill"
    );




    if(progress){


        progress.style.width =
        percentage+"%";


    }



}









// =======================================
// HELPERS
// =======================================


function calculateAverage(player){


    if(
        !player.averages ||
        player.averages.length===0
    ){

        return 0;

    }



    let total =

    player.averages.reduce(
        (a,b)=>a+b,
        0
    );



    return (

        total /

        player.averages.length

    );


}







function formatDate(date){


    if(!date){

        return "TBC";

    }



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