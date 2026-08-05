// =======================================
// PREMIERSHIP OF DARTS
// DOUBLE TROUBLE CUP
// DATA STORAGE
// VERSION 2.0
// =======================================



let competition = {



    name:
    "Double Trouble Cup",





    groups:{



        A:[],


        B:[],


        C:[],


        D:[]



    },







    fixtures:[],








    knockout:{


        semiFinal1:{


            player1:
            "Group B Winner",


            player2:
            "Group D Winner",


            score1:null,


            score2:null,


            winner:null


        },





        semiFinal2:{


            player1:
            "Group C Winner",


            player2:
            "Group A Winner",


            score1:null,


            score2:null,


            winner:null


        },







        final:{


            player1:null,


            player2:null,


            score1:null,


            score2:null,


            winner:null


        },







        champion:null



    }




};









// =======================================
// INITIAL DATA LOAD
// =======================================


function loadDefaultCompetition(){



    return competition;



}