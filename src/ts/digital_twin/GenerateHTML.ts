import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { UIManager } from '../core/UIManager';

export class GenerateHTML {

    public renderer: THREE.WebGLRenderer;
	public popUpSetting: (evt: any) => void;

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.generateHTML();
    }

    private generateHTML(): void{




		let bookMarkEnvTextName = "Indoor Environment";
		let bookMarkOccuTextName = "Occupancy Monitoring";
		let bookMarkReportTextName = "SCI-TU Report";

		let defaultColorTempLess = "rgba(40, 169, 255, 1)";
		let defaultColorTempGreaterThanEqualAndLessThanEqual = "rgba(2, 197, 35, 1)";
		let defaultColorTempMoreThan = "rgba(209, 49, 0, 1)";

		let tempLessValue = 15;
		let tempLessThanEqual = 30;

		let defaultColorHumidityLess = "rgba(226, 139, 12, 1)";
		let defaultColorHumidityGreaterThanEqualAndLessThanEqual = "rgba(2, 197, 35, 1)";
		let defaultColorHumidityMoreThan = "rgba(40, 169, 255, 1)";

		let humidityLessValue = 30;
		let humidityLessThanEqual = 70;


		// Fonts
		$('head').append('<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet">');
		$('head').append('<link href="https://fonts.googleapis.com/css2?family=Solway:wght@400;500;700&display=swap" rel="stylesheet">');
		$('head').append('<link href="https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap" rel="stylesheet">');
		$('head').append('<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>');

		// $('head').append('<script src="https://cdn.plot.ly/plotly-2.14.0.min.js"></script>');

		// Loader
		$(`	<div id="loading-screen">
				<div id="loading-screen-background"></div>
				<h1 id="main-title" class="sb-font">CSTU Digital Twin</h1>
				<div class="cubeWrap">
					<div class="cube">
						<div class="faces1"></div>
						<div class="faces2"></div>     
					</div> 
				</div> 
				<div id="loading-text">Loading...</div>
			</div>
		`).appendTo('body');

		// <div id="menu_mouse_click"><i class="fas fa-mouse-pointer"></i><span class="tooltiptext">Click</span></div>
		// <div id="menu_mouse_move"><i class="fas fa-expand-arrows-alt"></i></i><span class="tooltiptext">Move</span></div>
		// <div id="menu_mouse_rotate"><i class="fas fa-sync-alt"></i></i><span class="tooltiptext">Rotate</span></div>
		// <div id="menu_mouse_zoom_in"><i class="fas fa-search-plus"></i></i><span class="tooltiptext">Zoom In</span></div>
		// <div id="menu_mouse_zoom_out"><i class="fas fa-search-minus"></i></i><span class="tooltiptext">Zoom Out</span></div>

		// <div class="ui-container-camera_position" id="position_camera">x:0, y: 0, z: 0</div>
		// sessionStorage.setItem("display", "sage");
		sessionStorage.setItem("display", "webapp");
        // sessionStorage.setItem("display", new URLSearchParams(window.location.search).get('display') || null);
        sessionStorage.setItem("data", new URLSearchParams(window.location.search).get('data') || null);

		let toggleMenu = sessionStorage.getItem("display") === "sage" ? "none": "block";
		
		// console.log("xxxxxxxxxxxx " + toggleMenu);
		$(`	<div id="ui-container" style="display: none;">
				<div class="left-panel">
					<div id="controls" class="panel-segment flex-bottom"></div>
				</div>
			</div>

			<div id="ui-container-menu-object-mode">
					<div id="menuBottom" style="display: ${toggleMenu};">
						<div id="menuBottomheader">Object Mode</div>
						<div >
							<div id="menu_click"><i class="fas fa-mouse-pointer"></i><span class="tooltiptext">Click</span></div>
							<div id="menu_rotate"><i class="fas fa-sync-alt"></i></i><span class="tooltiptext">Rotate</span></div>
						</div>
                    </div>                 
			</div>
			
			<div id="ui-container-search_room">
					<div id="menu_search_room" style="display: ${toggleMenu};">
						<div id="menu_search_roomheader">Search A Room</div>
						<div>
						<select id="selected_room_search">
						</select>
						</div>
                    </div>                 
            </div>

            <div id="ui-container-menu-floor">
                <div id="menuFloor" style="display: ${toggleMenu};">
                    <div id="menuFloorheader">Floor</div>
                    <div >
                        <div id="menu_floor1">1</div>
                        <div id="menu_floor2">2</div>
                        <div id="menu_floor3">3</div>
                        <div id="menu_site">Site</div>
                    </div>
                </div>                    
			</div>
			
            <div id="ui-container-menu-label">
                <div id="menuLabel" style="display: ${toggleMenu};">
                    <div id="menuLabelheader">Label <span id="sync_label" style="display: none;"><i class="sync_iot_data fas fa-sync-alt"></i></span></div>
					<div >
						<div class="menu_Label_cursor" id="menu_Label0"><i class="fas fa-tags"></i><span class="tooltiptext">Name Of Room</span></div>
                        <div class="menu_Label_cursor" id="menu_Label1"><i class="fas fa-exclamation-circle"></i><span class="tooltiptext">SCI-TU Report</span></div>
                        <div class="menu_Label_cursor" id="menu_Label2"><i class="fas fa-thermometer-half"></i><span class="tooltiptext">Temperature</span></div>
                        <div class="menu_Label_cursor" id="menu_Label3"><i class="fas fa-tint"></i><span class="tooltiptext">Humidity</span></div>
                        <div class="menu_Label_cursor" id="menu_Label4"><i class="fas fa-lightbulb"></i><span class="tooltiptext">Light</span></div>
						<div class="menu_Label_cursor" id="menu_Label5"><i class="fas fa-male"></i><span class="tooltiptext">Occupant</span></div>
						<div class="menu_Label_cursor" id="menu_Label6"><i class="fad fa-video"></i><span class="tooltiptext">Surveillance</span></div>
                    </div>
                </div>                    
            </div>

            <div id="ui-container-menu-view">
                <div id="menuView" style="display: ${toggleMenu};">
                    <div id="menuViewheader">Perspective</div>
					<div >
						<div id="menu_walk"><i class="fas fa-shoe-prints"></i><span class="tooltiptext">Walk</span></div>
                        <div id="menu_fly"><i class="fas fa-ghost"></i><span class="tooltiptext">Ghost</span></div>
                        <div id="menu_thirdperson"><i class="fas fa-male"></i><span class="tooltiptext">Third Person</span></div>
                    </div>
                </div>                    
            </div>

			<div id="ui-container-right">
				<div class="right-panel">
					<div id="setting-btn" class="ul">
						<i class="fas fa-cog"></i>
					</div>
				</div>
			</div>


			<div id="ui-container-bookMarkEnv">
				<div id="bookmarkIndoorEnvironmentBtn" class="bookMarkOnRightScreen">
					<div id="notiEnvOnBookMark" class="notiOnBookMark" style="display: none;">0</div> ${bookMarkEnvTextName}
				</div>
			</div>

			<div id="ui-container-bookMarkOccu">
				<div id="bookmarkOccupancyBtn" class="bookMarkOnRightScreen">
				<div id="notiOccuOnBookMark" class="notiOnBookMark" style="display: none;">0</div> ${bookMarkOccuTextName}
				</div>
			</div>

			<div id="ui-container-bookMarkReport">
				<div id="bookmarkReportBtn" class="bookMarkOnRightScreen">
				<div id="notiReportOnBookMark" class="notiOnBookMark" style="display: none;">0</div> ${bookMarkReportTextName}
				</div>
			</div>

            <div class="ui-container-bookMarkEnvContentBox">
                <div id="bookMarkEnvContentBox" style="display: none;">
                    <div id="bookMarkEnvContentBoxheader">
						${bookMarkEnvTextName}
						<div id="settingsEnvBtnOnBookMark" class="settingsBtnOnBookMark"><i class="fas fa-cog"></i></div>
						<div id="closeEnvBtnOnBookMark" class="closeBtnOnBookMark">X</div>
					</div>
                    <div id="envContentBox" class="contentBox">
						Everything seem to be ok.
                    </div>
                </div>                    
			</div>

            <div class="ui-container-bookMarkOccuContentBox">
                <div id="bookMarkOccuContentBox" style="display: none;">
                    <div id="bookMarkOccuContentBoxheader">
						${bookMarkOccuTextName}
						<div id="settingsOccuBtnOnBookMark" class="settingsBtnOnBookMark"><i class="fas fa-cog"></i></div>
						<div id="closeOccuBtnOnBookMark" class="closeBtnOnBookMark">X</div>
					</div>
                    <div class="contentBox">
						Everything seem to be ok.
                    </div>
                </div>                    
			</div>


            <div class="ui-container-bookMarkReportContentBox">
                <div id="bookMarkReportContentBox" style="display: none;">
                    <div id="bookMarkReportContentBoxheader">
						${bookMarkReportTextName}
						<div id="settingsReportBtnOnBookMark" class="settingsBtnOnBookMark" style="display: none;"><i class="fas fa-cog"></i></div>
						<div id="closeReportBtnOnBookMark" class="closeBtnOnBookMark">X</div>
					</div>
                    <div id="plotly_pie_status" class="contentBox">
						Everything seem to be ok.
						<!--
						<iframe src="http://localhost:8081/pie?room=108&floor=1&from=1628854789000&to=1648854789000" title="Pie"
						frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe> 
						-->
                    </div>
                </div>                    
			</div>



            <div class="ui-container-settingsEnvContentBox">
                <div id="settingsEnvContentBox" style="display: none;">
                    <div id="settingsEnvContentBoxheader">
						${bookMarkEnvTextName} Settings
						<div id="closeEnvBtnOnSettings" class="closeBtnOnBookMark">X</div>
					</div>
                    <div class="contentBox">

					<!-- ================================== Temperature Settings ================================== -->
						<div class="boxOfOneEntryOfIndoorSettings">
							<div class="fieldOfIndoorEnvironment"><i class="fas fa-thermometer-half"></i> Temperature</div>
							<div class="rowSettingIndoor">
								<div class="rowSettingIndoorFlex">
									<span id="notiToggleTemp1" class="notiToggleIndoor"><i class="fas fa-bell"></i></span>
								</div>
								<div class="rowSettingIndoorFlex">
									<div id="selectTempColor1" class="colorBox" style="background-color: ${defaultColorTempLess};"> 
										<span class="tooltiptext">Cold</span>
									</div>
								</div>
								<div class="rowSettingIndoorFlex"><i class="fas fa-less-than"></i></div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorTemp1" value="${tempLessValue}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									${'\xb0C'.length == 3 ? '\xb0C'.slice(1) : '\xb0C'}
								</div>
							</div>
							<div class="rowSettingIndoor">
								<div class="rowSettingIndoorFlex"><span id="notiToggleTemp2" class="notiToggleIndoor"><i class="fas fa-bell"></i></span></div>
								<div class="rowSettingIndoorFlex">
									<div id="selectTempColor2" class="colorBox" style="background-color: ${defaultColorTempGreaterThanEqualAndLessThanEqual};"> 
										<span class="tooltiptext">Good</span>
									</div>
								</div>
								<div class="rowSettingIndoorFlex"><i class="fad fa-greater-than-equal"></i></div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorTemp2" value="${tempLessValue}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									${'\xb0C'.length == 3 ? '\xb0C'.slice(1) : '\xb0C'}
								</div>
								<div class="rowSettingIndoorFlex">and</div>
								<div class="rowSettingIndoorFlex"><i class="fad fa-less-than-equal"></i></div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorTemp3" value="${tempLessThanEqual}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									${'\xb0C'.length == 3 ? '\xb0C'.slice(1) : '\xb0C'}
								</div>
							</div>
							<div class="rowSettingIndoor">
								<div class="rowSettingIndoorFlex">
									<span id="notiToggleTemp3" class="notiToggleIndoor"><i class="fas fa-bell"></i></span>
								</div>
								<div class="rowSettingIndoorFlex">
									<div id="selectTempColor3" class="colorBox" style="background-color: ${defaultColorTempMoreThan};"> 
										<span class="tooltiptext">Hot</span> 
									</div>
								</div>
								<div class="rowSettingIndoorFlex">
									<i class="fas fa-greater-than"></i>
								</div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorTemp4" value="${tempLessThanEqual}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									${'\xb0C'.length == 3 ? '\xb0C'.slice(1) : '\xb0C'}
								</div>
							</div>
						</div>

						<!-- ================================== Humidity Settings ================================== -->
						<div class="boxOfOneEntryOfIndoorSettings">
							<div class="fieldOfIndoorEnvironment"><i class="fas fa-tint"></i> Humidity</div>
							<div class="rowSettingIndoor">
								<div class="rowSettingIndoorFlex">
									<span id="notiToggleHumidity1" class="notiToggleIndoor"><i class="fas fa-bell"></i></span>
								</div>
								<div class="rowSettingIndoorFlex">
									<div id="selectHumidityColor1" class="colorBox" style="background-color: ${defaultColorHumidityLess};"> 
										<span class="tooltiptext">Dry</span>
									</div>
								</div>
								<div class="rowSettingIndoorFlex"><i class="fas fa-less-than"></i></div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorHumidity1" value="${humidityLessValue}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									<i class="fad fa-percentage"></i>
								</div>
							</div>
							<div class="rowSettingIndoor">
								<div class="rowSettingIndoorFlex"><span id="notiToggleHumidity2" class="notiToggleIndoor"><i class="fas fa-bell"></i></span></div>
								<div class="rowSettingIndoorFlex">
									<div id="selectHumidityColor2" class="colorBox" style="background-color: ${defaultColorHumidityGreaterThanEqualAndLessThanEqual};"> 
										<span class="tooltiptext">Good</span>
									</div>
								</div>
								<div class="rowSettingIndoorFlex"><i class="fad fa-greater-than-equal"></i></div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorHumidity2" value="${humidityLessValue}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									<i class="fad fa-percentage"></i>
								</div>
								<div class="rowSettingIndoorFlex">and</div>
								<div class="rowSettingIndoorFlex"><i class="fad fa-less-than-equal"></i></div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorHumidity3" value="${humidityLessThanEqual}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									<i class="fad fa-percentage"></i>
								</div>
							</div>
							<div class="rowSettingIndoor">
								<div class="rowSettingIndoorFlex">
									<span id="notiToggleHumidity3" class="notiToggleIndoor"><i class="fas fa-bell"></i></span>
								</div>
								<div class="rowSettingIndoorFlex">
									<div id="selectHumidityColor3" class="colorBox" style="background-color: ${defaultColorHumidityMoreThan};"> 
										<span class="tooltiptext">Moist</span> 
									</div>
								</div>
								<div class="rowSettingIndoorFlex">
									<i class="fas fa-greater-than"></i>
								</div>
								<div class="rowSettingIndoorFlex">
									<input class="inputRangeOfColor" type="text" id="setColorHumidity4" value="${humidityLessThanEqual}"></input>
								</div>
								<div class="rowSettingIndoorFlex">
									<i class="fad fa-percentage"></i>
								</div>
							</div>
						</div>


                    </div>
                </div>                    
			</div>


			<div id="ui-container-playback">
				<div id="playbackBox" class="playbackBox" style="display: none;">
					<div>
						<div id="playbackBtn"><i class="fas fa-play"></i></div>
						<div class="playbackSpeed activePlaybackSpeed" id="playbackSpeedX1" value="ON">x1</div>
						<div class="playbackSpeed" id="playbackSpeedX3" value="OFF">x3</div>
						<div class="playbackSpeed" id="playbackSpeedX10" value="OFF">x10</div>
					</div>
					<input type="range" min="1638604140436" max="1666726312000" value="1638604140436" class="slider" id="timeRangePlayBack">
					<span> <span id="timeValue">Playback Mode</span></span>
				</div>
			</div>




			<input id="room_id_updateModelRoom" type="text" style="display: none;"/>
			<div id="updateModelRoom"></div>

			<input id="startDate" type="text" style="display: none;"/>
			<input id="endDate" type="text" style="display: none;"/>

			<input id="isCurrentTimeBoolean" type="text" style="display: none;"/>
			<div id="toggleRealTime"></div>
			<div id="refreshComponents"></div>


		`).appendTo('body');

		$(`	<div id="ui-menu-click-room" class="ui-menu-click-room" style="display: none;">
				<div id="menu_click_room_ele" class="menu-click-room">
					<a id="open_report" href="#">view Sci-TU Report</a>
					<a id="" href="#">view IoT data</a>
				</div>
			</div>
		`).appendTo('body');

		$(`	<div id="open-modal" class="modal-window">
				<div>
					<a id="close-modal" href="#" title="Close" class="modal-close">Close</a>
					<h1>Room <font id="room_name" >106</font></h1>
					<input id="valueRoom" type="text" hidden>
					<div id="list_room_reports"></div>
				</div>
			</div>
		`).appendTo('body');

		// Canvas
		document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.id = 'canvas';
        
        this.settingOnClick();

		this.loadSettings();
		// if(new URLSearchParams(window.location.search).get('displayon') === 'sage'){
			// document.getElementById("menuBottom").style.display = 'none';
			// document.getElementById("menu_search_room").style.display = 'none';
			// document.getElementById("menuFloor").style.display = 'none';
			// document.getElementById("menuLabel").style.display = 'none';
			// document.getElementById("menuView").style.display = 'none';
		// }

    }

	private loadSettings(): void{
		document.getElementById("notiToggleTemp3").click();
		document.getElementById("notiToggleHumidity1").click();
		document.getElementById("notiToggleHumidity3").click();
	}

    private settingOnClick(): void{
		this.popUpSetting = () => this.popUpSettingFunction();
		document.getElementById("setting-btn").addEventListener('click', this.popUpSetting);

		document.getElementById("close-modal").addEventListener('click', function (event) {
			document.getElementById('open-modal').style.setProperty("visibility", "hidden");
		});


		// document.getElementById("bookmarkIndoorEnvironmentBtn").addEventListener("mouseover", (event) => {
		document.getElementById("bookmarkIndoorEnvironmentBtn").addEventListener("click", (event) => {
			document.getElementById("bookmarkIndoorEnvironmentBtn").style.display = 'none';
			let bookMarkEnvContentBox = document.getElementById("bookMarkEnvContentBox");
			bookMarkEnvContentBox.style.top = null;
			bookMarkEnvContentBox.style.bottom = null;
			bookMarkEnvContentBox.style.right = null;
			bookMarkEnvContentBox.style.left = null;
			bookMarkEnvContentBox.style.display = 'block';
		});

		document.getElementById("closeEnvBtnOnBookMark").addEventListener("click", (event) => {
			document.getElementById("bookmarkIndoorEnvironmentBtn").style.display = 'block';
			document.getElementById("bookMarkEnvContentBox").style.display = 'none';
			document.getElementById("settingsEnvContentBox").style.display = 'none';
		});


		document.getElementById("bookmarkOccupancyBtn").addEventListener("click", (event) => {
			document.getElementById("bookmarkOccupancyBtn").style.display = 'none';
			let bookMarkOccuContentBox = document.getElementById("bookMarkOccuContentBox");
			bookMarkOccuContentBox.style.top = null;
			bookMarkOccuContentBox.style.bottom = null;
			bookMarkOccuContentBox.style.right = null;
			bookMarkOccuContentBox.style.left = null;
			bookMarkOccuContentBox.style.display = 'block';
		});

		document.getElementById("closeOccuBtnOnBookMark").addEventListener("click", (event) => {
			document.getElementById("bookmarkOccupancyBtn").style.display = 'block';
			document.getElementById("bookMarkOccuContentBox").style.display = 'none';
		});


		// bookmarkReportBtn
		//bookMarkReportContentBox

		document.getElementById("bookmarkReportBtn").addEventListener("click", (event) => {
			document.getElementById("bookmarkReportBtn").style.display = 'none';
			let bookMarkReportContentBox = document.getElementById("bookMarkReportContentBox");
			bookMarkReportContentBox.style.top = null;
			bookMarkReportContentBox.style.bottom = null;
			bookMarkReportContentBox.style.right = null;
			bookMarkReportContentBox.style.left = null;
			bookMarkReportContentBox.style.display = 'block';
		});

		document.getElementById("closeReportBtnOnBookMark").addEventListener("click", (event) => {
			document.getElementById("bookmarkReportBtn").style.display = 'block';
			document.getElementById("bookMarkReportContentBox").style.display = 'none';
		});









		//=========================== Settings =========================== 
		document.getElementById("settingsEnvBtnOnBookMark").addEventListener("click", (event) => {
			let bookMarkReportContentBox = document.getElementById("settingsEnvContentBox");
			bookMarkReportContentBox.style.top = null;
			bookMarkReportContentBox.style.bottom = null;
			bookMarkReportContentBox.style.right = null;
			bookMarkReportContentBox.style.left = null;
			bookMarkReportContentBox.style.display = 'block';
		});

		document.getElementById("closeEnvBtnOnSettings").addEventListener("click", (event) => {
			document.getElementById("settingsEnvContentBox").style.display = 'none';
		});

		$("#notiToggleTemp1, #notiToggleTemp2, #notiToggleTemp3, #notiToggleHumidity1, #notiToggleHumidity2, #notiToggleHumidity3").on( "click", function(e) {

			// console.log(notiToggle.children[0]);
			// console.log($('#' + e.currentTarget.id).css('color'));
			let color = $('#' + e.currentTarget.id).css('color');
			if(color === 'rgb(255, 208, 0)'){
				$('#' + e.currentTarget.id).css('color', 'rgb(80, 80, 80)');
			}else{
				$('#' + e.currentTarget.id).css('color', 'rgb(255, 208, 0)');
			}
			// if(notiToggle.style.color === 'none'){
			// 	menu.style.display = 'block';
			// }else{
			// 	menu.style.display = 'none';
			// }

		});

		// document.getElementById("startDate").addEventListener('change', function(e) {
		// 	console.log('change startDate');
		// });

		// document.getElementById("endDate").addEventListener('change', function(e) {
		// 	console.log('change endDate');
		// });

		// $("#onclick_floor").on( "click", function(e) {


		// });

		// document.getElementById("selected_room_search").addEventListener('click', function (event) {
		// 	// console.log((<any>event).pointerId)
		// 	if((<any>event).pointerId === 0){
		// 		console.log((document.getElementById('selected_room_search') as HTMLInputElement).value);
		// 	}
			
		// });



	}

	public popUpSettingFunction(): void{

			// console.log(document.getElementById("menuBottom").style.display, document.getElementById("menuFloor").style.display === 'display', document.getElementById("menuLabel").style.display)
		let htmlSettingObjectMode = document.getElementById("menuBottom").style.display === 'block' ? 'checked': '';
		let htmlSettingFloor = document.getElementById("menuFloor").style.display === 'block' ? 'checked': '';
		let htmlSettingLabel = document.getElementById("menuLabel").style.display === 'block' ? 'checked': '';
		let htmlSettingSearchRoom = document.getElementById("menu_search_room").style.display === 'block' ? 'checked': '';
		let htmlSettingView = document.getElementById("menuView").style.display === 'block' ? 'checked': '';
		
		let htmlSettingModeLivePlayback = document.getElementById("playbackBox").style.display === 'block' ? '': 'checked';

			// console.log(htmlSettingObjectMode, htmlSettingFloor, htmlSettingLabel)
			Swal.fire({
				title: 'Settings',
				html: '<div>'+ 
						'<div class="header-settings">Hide/Unhide Menu</div>'+
						'<div class="vc-toggle-container">'+
							'<label id="onclick_objectMode" class="vc-switch">'+
								'<input id="checkbox_objectMode" type="checkbox" class="vc-switch-input" ' + htmlSettingObjectMode + '/>'+
								'<span class="vc-switch-label" data-on="ON" data-off="OFF"></span>'+
								'<span class="vc-handle"></span>'+
							'</label>'+
							'<label style="margin-left: 5px;">Menu Object Mode</label>'+
						'</div>'+
						'</div>'+

					'<div>'+ 
						'<div class="vc-toggle-container">'+
							'<label id="onclick_floor" class="vc-switch">'+
								'<input id="checkbox_floor" type="checkbox" class="vc-switch-input" ' + htmlSettingFloor + '/>'+
								'<span class="vc-switch-label" data-on="ON" data-off="OFF"></span>'+
								'<span class="vc-handle"></span>'+
							'</label>'+
							'<label style="margin-left: 5px;">Menu Floor</label>'+
						'</div>' +
					'</div>'+

					'<div>'+ 
						'<div class="vc-toggle-container">'+
							'<label id="onclick_label" class="vc-switch">'+
								'<input id="checkbox_label" type="checkbox" class="vc-switch-input" ' + htmlSettingLabel + '/>'+
								'<span class="vc-switch-label" data-on="ON" data-off="OFF"></span>'+
								'<span class="vc-handle"></span>'+
							'</label>'+
							'<label style="margin-left: 5px;">Menu Label</label>'+
						'</div>'+
					'</div>'+
					
					'<div>'+ 
						'<div class="vc-toggle-container">'+
							'<label id="onclick_searchRoom" class="vc-switch">'+
								'<input id="checkbox_searchRoom" type="checkbox" class="vc-switch-input" ' + htmlSettingSearchRoom + '/>'+
								'<span class="vc-switch-label" data-on="ON" data-off="OFF"></span>'+
								'<span class="vc-handle"></span>'+
							'</label>'+
							'<label style="margin-left: 5px;">Menu Search A Room</label>'+
						'</div>' +
					'</div>' +

					'<div>'+ 
						'<div class="vc-toggle-container">'+
							'<label id="onclick_view" class="vc-switch">'+
								'<input id="checkbox_view" type="checkbox" class="vc-switch-input" ' + htmlSettingView + '/>'+
								'<span class="vc-switch-label" data-on="ON" data-off="OFF"></span>'+
								'<span class="vc-handle"></span>'+
							'</label>'+
							'<label style="margin-left: 5px;">Menu View</label>'+
						'</div>' +
					'</div>' +

					'<div class="header-settings">Advance</div>' +

					'<div>'+ 
						'<div class="vc-toggle-container">'+
							'<label id="onclick_modeliveplayback" class="vc-switch">'+
								'<input id="checkbox_modeLivePlaback" type="checkbox" class="vc-switch-input" ' + htmlSettingModeLivePlayback + '/>'+
								'<span class="vc-switch-label vc-switch-changeColor-mode" data-on="LIVE" data-off="PLAYBAcK"></span>'+
								'<span class="vc-handle"></span>'+
							'</label>'+
							// '<label style="margin-left: 5px;">Mode</label>'+
						'</div>' +
					'</div>' 

					,

				text: 'Setting',
				footer: '',
				confirmButtonText: 'Done',
				buttonsStyling: false,
				onClose: () => {
					UIManager.setUserInterfaceVisible(true);
				}
			});


			$("#onclick_objectMode").on( "click", function(e) {
				
				if($(e)[0].target.className === 'vc-switch-input'){
					// console.log("test object")

					// let ele = document.getElementById("checkbox_objectMode") as HTMLInputElement;
					// ele.checked

					let menu = document.getElementById("menuBottom") as HTMLInputElement;
					if(menu.style.display === 'none'){
						menu.style.display = 'block';
					}else{
						menu.style.display = 'none';
					}
					// console.log(menu.style.display)

				}



			});


			$("#onclick_floor").on( "click", function(e) {

				if($(e)[0].target.className === 'vc-switch-input'){
					// console.log("test floor")

					// let ele = document.getElementById("checkbox_floor") as HTMLInputElement;

					// if(ele.checked){
					// 	sessionStorage.setItem("settingFloor", JSON.stringify(false));
					// }else{
					// 	sessionStorage.setItem("settingFloor", JSON.stringify(true));
					// }

					// let menu = document.getElementById("menuFloor") as HTMLInputElement;
					// if(JSON.parse(sessionStorage.getItem("settingFloor"))){
					// 	menu.style.display = 'block';
					// }else{
					// 	menu.style.display = 'none';
					// }


					let menu = document.getElementById("menuFloor") as HTMLInputElement;
					if(menu.style.display === 'none'){
						menu.style.display = 'block';
					}else{
						menu.style.display = 'none';
					}

				}

			});

			$("#onclick_label").on( "click", function(e) {

				if($(e)[0].target.className === 'vc-switch-input'){
					// console.log("test label")

					// let ele = document.getElementById("checkbox_label") as HTMLInputElement;

					// if(ele.checked){
					// 	sessionStorage.setItem("settingLabel", JSON.stringify(false));
					// }else{
					// 	sessionStorage.setItem("settingLabel", JSON.stringify(true));
					// }

					// let menu = document.getElementById("menuLabel") as HTMLInputElement;
					// if(JSON.parse(sessionStorage.getItem("settingLabel"))){
					// 	menu.style.display = 'block';
					// }else{
					// 	menu.style.display = 'none';
					// }

					let menu = document.getElementById("menuLabel") as HTMLInputElement;
					if(menu.style.display === 'none'){
						menu.style.display = 'block';
					}else{
						menu.style.display = 'none';
					}

				}

			});

			$("#onclick_searchRoom").on( "click", function(e) {

				if($(e)[0].target.className === 'vc-switch-input'){
					let menu = document.getElementById("menu_search_room") as HTMLInputElement;
					if(menu.style.display === 'none'){
						menu.style.display = 'block';
					}else{
						menu.style.display = 'none';
					}
				}

			});

			$("#onclick_view").on( "click", function(e) {

				if($(e)[0].target.className === 'vc-switch-input'){
					let menu = document.getElementById("menuView") as HTMLInputElement;
					if(menu.style.display === 'none'){
						menu.style.display = 'block';
					}else{
						menu.style.display = 'none';
					}
				}

			});


			$("#onclick_modeliveplayback").on( "click", function(e) {

				if($(e)[0].target.className === 'vc-switch-input'){
					let menu = document.getElementById("playbackBox") as HTMLInputElement;
					if(menu.style.display === 'none'){
						menu.style.display = 'block';
					}else{
						menu.style.display = 'none';
					}
					let checkboxLiveOrPlayback = document.getElementById("checkbox_modeLivePlaback") as HTMLInputElement;
					// console.log(checkboxLiveOrPlayback.checked);

					(document.getElementById("checkbox_modeLivePlaback") as HTMLInputElement).value = checkboxLiveOrPlayback.checked + "";
					document.getElementById("toggleRealTime").click();
					// isCurrentTimeBoolean

				}

			});


			// let bookmarkIndoorEnvironmentBtn = document.getElementById("bookmarkIndoorEnvironmentBtn");

			// bookmarkIndoorEnvironmentBtn.addEventListener("mouseenter", (event) => {
			// 	console.log("ssss");

			// });

			// bookmarkIndoorEnvironmentBtn.addEventListener("click", (event) => {
			// 	console.log("ssss click");

			// });

			// document.getElementById("bookmarkIndoorEnvironmentBtn").onmouseover = function() {
			// 	console.log("bookmarkIndoorEnvironmentBtn");
			// };

	}

  }