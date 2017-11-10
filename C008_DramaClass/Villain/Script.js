var C008_DramaClass_Villain_CurrentStage = 100;
var C008_DramaClass_Villain_PlayerIsVillain = false;
var C008_DramaClass_Villain_PlayerIsHeroine = false;
var C008_DramaClass_Villain_PlayerIsDamsel = false;
var C008_DramaClass_Villain_ForgetLineDone = false;
var C008_DramaClass_Villain_SnapFingersDone = false;
var C008_DramaClass_Villain_CanDisarm = false;
var C008_DramaClass_Villain_CanIntimidate = false;
var C008_DramaClass_Villain_IsGagged = false;

// Chapter 8 - Villain Load
function C008_DramaClass_Villain_Load() {

	// Checks if the player is the villain & set the stage to the current global stage
	C008_DramaClass_Villain_PlayerIsVillain = (C008_DramaClass_JuliaIntro_PlayerRole == "Villain");
	C008_DramaClass_Villain_PlayerIsHeroine = (C008_DramaClass_JuliaIntro_PlayerRole == "Heroine");
	C008_DramaClass_Villain_PlayerIsDamsel = (C008_DramaClass_JuliaIntro_PlayerRole == "Damsel");
	C008_DramaClass_Villain_CurrentStage = C008_DramaClass_Theater_GlobalStage;

	// Load the scene parameters
	if (!C008_DramaClass_Villain_PlayerIsVillain) ActorLoad(C008_DramaClass_Theater_Villain, "Theater");
	LoadInteractions();
	LeaveIcon = "Leave";
	LeaveScreen = "Theater";
	C008_DramaClass_Villain_IsGagged = ActorIsGagged();
	
	// The player can disarm if sub +2 vs Amanda and intimidate if sub + 10
	C008_DramaClass_Villain_CanDisarm = (C008_DramaClass_Villain_PlayerIsVillain && (ActorSpecificGetValue("Amanda", ActorSubmission) >= 2));
	C008_DramaClass_Villain_CanIntimidate = (C008_DramaClass_Villain_PlayerIsVillain && (ActorSpecificGetValue("Amanda", ActorSubmission) >= 10));

}

// Chapter 8 - Villain Run
function C008_DramaClass_Villain_Run() {
	BuildInteraction(C008_DramaClass_Villain_CurrentStage);
	if ((C008_DramaClass_Villain_CurrentStage != 260) && (C008_DramaClass_Villain_CurrentStage != 290)) DrawInteractionActor();
}

// Chapter 8 - Villain Click
function C008_DramaClass_Villain_Click() {	

	// Regular and inventory interactions
	ClickInteraction(C008_DramaClass_Villain_CurrentStage);
	var ClickInv = GetClickedInventory();

	// A second rope can be applied on the fight loser before the play is over
	if ((ClickInv == "Rope") && (C008_DramaClass_Villain_CurrentStage == 250) && C008_DramaClass_Villain_PlayerIsHeroine)
		ActorApplyRestrain(ClickInv);

}

// Chapter 8 - Villain - Sets the global stage and can alter Julia's mood
function C008_DramaClass_Villain_GlobalStage(GlobalStage, LoveMod, SubMod) {
	C008_DramaClass_Theater_GlobalStage = GlobalStage;
	LeaveIcon = "Leave";
	if (!C008_DramaClass_Villain_SnapFingersDone || (SubMod <= 0)) ActorSpecificChangeAttitude("Julia", LoveMod, SubMod);
	if (SubMod > 0) C008_DramaClass_Villain_SnapFingersDone = true;
	if (LoveMod < 0) C008_DramaClass_Theater_PerfectPlay = false;
	C008_DramaClass_Theater_SetPose();
}

// Chapter 8 - Villain - When the player forgets her line
function C008_DramaClass_Villain_ForgetLine() {
	if (!C008_DramaClass_Villain_ForgetLineDone) {
		C008_DramaClass_Villain_ForgetLineDone = true;
		C008_DramaClass_Theater_PerfectPlay = false;
		ActorSpecificChangeAttitude("Julia", 0, -1);
	}
}

// Chapter 8 - Villain - If the player surrenders without fighting, she becomes more sub toward everyone
function C008_DramaClass_Villain_Surrender() {
	ActorSpecificChangeAttitude("Amanda", 0, -2);
	ActorSpecificChangeAttitude("Sarah", 0, -2);
	ActorSpecificChangeAttitude("Julia", 0, -2);
	C008_DramaClass_Theater_GlobalStage = C008_DramaClass_Villain_CurrentStage;
	C008_DramaClass_Theater_SetPose();
}

// Chapter 8 - Villain - Prevent the player from leaving
function C008_DramaClass_Villain_NoLeave() {
	LeaveIcon = "";
}

// Chapter 8 - Villain - Do the fight between Amanda as the villain and Sarah as the heroine
function C008_DramaClass_Villain_AmandaSarahFight(CheerFactor) {
	
	// Victory depends on who's more Domme and the cheering from the player
	if ((ActorSpecificGetValue("Amanda", ActorSubmission) * -1) - (ActorSpecificGetValue("Sarah", ActorSubmission) * -1) + CheerFactor >= 0) {
		
		// Amanda the villain wins
		C008_DramaClass_Villain_CurrentStage = 270;
		C008_DramaClass_Theater_GlobalStage = 270;
		OverridenIntroText = GetText("PlayerDamselVillainWin");
		C008_DramaClass_Theater_SetPose();

	} else {

		// Sarah the heroine wins
		C008_DramaClass_Villain_CurrentStage = 240;
		C008_DramaClass_Theater_GlobalStage = 240;
		OverridenIntroText = GetText("PlayerDamselHeroineWin");
		C008_DramaClass_Theater_SetPose();

	}
	
}

// Chapter 8 - Villain - When the villain kisses the damsel, it finishes the play
function C008_DramaClass_Villain_FinalKiss() {
	OverridenIntroImage = "../HugImages/VillainAmandaDamselPlayerKiss.jpg"; 
	ActorSpecificChangeAttitude("Amanda", 2, 0); 
	ActorSpecificChangeAttitude("Sarah", -3, 0);
	C008_DramaClass_Theater_GlobalStage = 300;
	C008_DramaClass_Theater_Ending = "Kiss";
}

// Chapter 8 - Villain - When the villain hugs the damsel, it finishes the play
function C008_DramaClass_Villain_FinalHug() {
	OverridenIntroImage = "../HugImages/VillainAmandaDamselPlayerHug.jpg"; 
	ActorSpecificChangeAttitude("Amanda", 1, 0); 
	ActorSpecificChangeAttitude("Sarah", -1, 0);
	C008_DramaClass_Theater_GlobalStage = 300;
	C008_DramaClass_Theater_Ending = "Hug";
}

// Chapter 8 - Villain - When the damsel kneels for the villain, it finishes the play
function C008_DramaClass_Villain_FinalDomme() {
	OverridenIntroImage = "../HugImages/VillainAmandaDamselPlayerDomme.jpg"; 
	ActorSpecificChangeAttitude("Amanda", 1, -2);
	ActorSpecificChangeAttitude("Sarah", -1, 0);
	C008_DramaClass_Theater_GlobalStage = 300;
	C008_DramaClass_Theater_Ending = "Domme";
}