// =======================================
// PREMIERSHIP OF DARTS
// LOCAL STORAGE SYSTEM
// VERSION 1.0
// =======================================


const STORAGE_KEY = "premiership_darts_double_trouble";




// =======================================
// SAVE COMPETITION
// =======================================

function saveCompetition(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(competition)
    );

}





// =======================================
// LOAD COMPETITION
// =======================================

function loadCompetition(){


    const saved =
    localStorage.getItem(STORAGE_KEY);



    if(!saved){

        return;

    }



    const savedCompetition =
    JSON.parse(saved);



    Object.assign(
        competition,
        savedCompetition
    );


}






// =======================================
// RESET COMPETITION
// =======================================

function resetCompetition(){


    if(
        confirm(
        "Reset Double Trouble Cup? All results will be removed."
        )
    ){


        localStorage.removeItem(
            STORAGE_KEY
        );


        location.reload();


    }


}






// =======================================
// AUTO SAVE
// =======================================


window.addEventListener(
    "beforeunload",
    ()=>{

        saveCompetition();

    }
);