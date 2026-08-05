// =======================================
// PREMIERSHIP OF DARTS
// DOUBLE TROUBLE CUP
// FIXTURE MANAGEMENT
// VERSION 1.1
// =======================================



let selectedFixtureEdit = null;









// =======================================
// OPEN FIXTURE EDITOR
// =======================================


function openFixtureEditor(id){



    selectedFixtureEdit =

    competition.fixtures.find(
        fixture =>
        fixture.id === id
    );





    if(!selectedFixtureEdit){

        return;

    }







    const modal =

    document.getElementById(
        "fixtureModal"
    );



    const body =

    document.getElementById(
        "fixtureModalBody"
    );







    body.innerHTML = `



    <div class="fixture-editor-title">

    Edit Fixture

    </div>







    <div class="fixture-editor-match">


    ${selectedFixtureEdit.player1}


    <br>


    <span>

    VS

    </span>


    <br>


    ${selectedFixtureEdit.player2}


    </div>









    <div class="fixture-editor-field">


    <label>

    Fixture Date

    </label>


    <input

    type="date"

    id="editFixtureDate"

    value="${selectedFixtureEdit.date || ""}">


    </div>









    <div class="fixture-editor-field">


    <label>

    Fixture Time

    </label>



    <input

    type="time"

    id="editFixtureTime"

    value="${selectedFixtureEdit.time || ""}">


    </div>








    <button

    class="fixture-save-button"

    onclick="saveFixtureEdit()">


    Save Fixture


    </button>





    <button

    class="fixture-close-button"

    onclick="closeFixtureEditor()">


    Cancel


    </button>




    `;







    modal.classList.add(
        "show"
    );



}









// =======================================
// SAVE FIXTURE
// =======================================


function saveFixtureEdit(){



    if(!selectedFixtureEdit){

        return;

    }







    const date =

    document.getElementById(
        "editFixtureDate"
    )
    .value;





    const time =

    document.getElementById(
        "editFixtureTime"
    )
    .value;








    selectedFixtureEdit.date = date;



    selectedFixtureEdit.time = time;








    saveCompetition();





    closeFixtureEditor();





    refreshCompetition();




}









// =======================================
// CLOSE POPUP
// =======================================


function closeFixtureEditor(){



    const modal =

    document.getElementById(
        "fixtureModal"
    );




    if(modal){


        modal.classList.remove(
            "show"
        );


    }




    selectedFixtureEdit=null;



}