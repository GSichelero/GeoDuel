export function Home() {
    return (
    <div className="rendered-form">
        <div className="">
        <h1  id="control-8251051">
            Create a Room
        </h1>
        </div>
        <div className="formbuilder-text form-group field-yourName">
        <label htmlFor="yourName" className="formbuilder-text-label">
            Your Name<span className="formbuilder-required">*</span>
        </label>
        <input
            type="text"
            className="form-control"
            name="yourName"
            id="yourName"
            aria-required="true"
        />
        </div>
        <div className="formbuilder-text form-group field-roomName">
        <label htmlFor="roomName" className="formbuilder-text-label">
            Room Name<span className="formbuilder-required">*</span>
        </label>
        <input
            type="text"
            className="form-control"
            name="roomName"
            id="roomName"
            aria-required="true"
        />
        </div>
        <div className="formbuilder-select form-group field-numberOfPlayers">
        <label htmlFor="numberOfPlayers" className="formbuilder-select-label">
            Number of players<span className="formbuilder-required">*</span>
        </label>
        <select
            className="form-control"
            name="numberOfPlayers"
            id="numberOfPlayers"
            aria-required="true"
        >
            <option value="{2}" id="numberOfPlayers-0">
            2
            </option>
            <option value="{3}" id="numberOfPlayers-1">
            3
            </option>
            <option value="{4}" id="numberOfPlayers-2">
            4
            </option>
            <option value="{5}" id="numberOfPlayers-3">
            5
            </option>
            <option value="{6}" id="numberOfPlayers-4">
            6
            </option>
        </select>
        </div>
        <div className="formbuilder-select form-group field-numberOfPlacesPerMatch">
        <label
            htmlFor="numberOfPlacesPerMatch"
            className="formbuilder-select-label"
        >
            Number of places per match
            <span className="formbuilder-required">*</span>
        </label>
        <select
            className="form-control"
            name="numberOfPlacesPerMatch"
            id="numberOfPlacesPerMatch"
            aria-required="true"
        >
            <option value="{1}" id="numberOfPlacesPerMatch-0">
            1
            </option>
            <option value="{2}" id="numberOfPlacesPerMatch-1">
            2
            </option>
            <option value="{3}" id="numberOfPlacesPerMatch-2">
            3
            </option>
            <option value="{4}" id="numberOfPlacesPerMatch-3">
            4
            </option>
            <option value="{5}" id="numberOfPlacesPerMatch-4">
            5
            </option>
            <option value="{6}" id="numberOfPlacesPerMatch-5">
            6
            </option>
            <option value="{7}" id="numberOfPlacesPerMatch-6">
            7
            </option>
            <option value="{8}" id="numberOfPlacesPerMatch-7">
            8
            </option>
            <option value="{9}" id="numberOfPlacesPerMatch-8">
            9
            </option>
            <option value="{10}" id="numberOfPlacesPerMatch-9">
            10
            </option>
        </select>
        </div>
        <div className="formbuilder-select form-group field-timeOfThePickingPhase">
        <label
            htmlFor="timeOfThePickingPhase"
            className="formbuilder-select-label"
        >
            Time of the picking phase (minutes)
            <span className="formbuilder-required">*</span>
        </label>
        <select
            className="form-control"
            name="timeOfThePickingPhase"
            id="timeOfThePickingPhase"
            aria-required="true"
        >
            <option value="{1}" id="timeOfThePickingPhase-0">
            1
            </option>
            <option value="{2}" id="timeOfThePickingPhase-1">
            2
            </option>
            <option value="{3}" id="timeOfThePickingPhase-2">
            3
            </option>
            <option value="{4}" id="timeOfThePickingPhase-3">
            4
            </option>
            <option value="{5}" id="timeOfThePickingPhase-4">
            5
            </option>
            <option value="{6}" id="timeOfThePickingPhase-5">
            6
            </option>
            <option value="{7}" id="timeOfThePickingPhase-6">
            7
            </option>
            <option value="{8}" id="timeOfThePickingPhase-7">
            8
            </option>
            <option value="{9}" id="timeOfThePickingPhase-8">
            9
            </option>
            <option value="{10}" id="timeOfThePickingPhase-9">
            10
            </option>
            <option value="{11}" id="timeOfThePickingPhase-10">
            11
            </option>
            <option value="{12}" id="timeOfThePickingPhase-11">
            12
            </option>
            <option value="{13}" id="timeOfThePickingPhase-12">
            13
            </option>
            <option value="{14}" id="timeOfThePickingPhase-13">
            14
            </option>
            <option value="{15}" id="timeOfThePickingPhase-14">
            15
            </option>
        </select>
        </div>
        <div className="formbuilder-select form-group field-timeOfTheGuessingPhase">
        <label
            htmlFor="timeOfTheGuessingPhase"
            className="formbuilder-select-label"
        >
            Time of the guessing phase (minutes)
            <span className="formbuilder-required">*</span>
        </label>
        <select
            className="form-control"
            name="timeOfTheGuessingPhase"
            id="timeOfTheGuessingPhase"
            aria-required="true"
        >
            <option value="{1}" id="timeOfTheGuessingPhase-0">
            1
            </option>
            <option value="{2}" id="timeOfTheGuessingPhase-1">
            2
            </option>
            <option value="{3}" id="timeOfTheGuessingPhase-2">
            3
            </option>
            <option value="{4}" id="timeOfTheGuessingPhase-3">
            4
            </option>
            <option value="{5}" id="timeOfTheGuessingPhase-4">
            5
            </option>
            <option value="{6}" id="timeOfTheGuessingPhase-5">
            6
            </option>
            <option value="{7}" id="timeOfTheGuessingPhase-6">
            7
            </option>
            <option value="{8}" id="timeOfTheGuessingPhase-7">
            8
            </option>
            <option value="{9}" id="timeOfTheGuessingPhase-8">
            9
            </option>
            <option value="{10}" id="timeOfTheGuessingPhase-9">
            10
            </option>
            <option value="{11}" id="timeOfTheGuessingPhase-10">
            11
            </option>
            <option value="{12}" id="timeOfTheGuessingPhase-11">
            12
            </option>
            <option value="{13}" id="timeOfTheGuessingPhase-12">
            13
            </option>
            <option value="{14}" id="timeOfTheGuessingPhase-13">
            14
            </option>
            <option value="{15}" id="timeOfTheGuessingPhase-14">
            15
            </option>
        </select>
        </div>
        <div className="formbuilder-button form-group field-createRoom">
        <button
            type="submit"
            className="btn-success btn"
            name="createRoom"
            style={{}}
            id="createRoom"
        >
            Create Room
        </button>
        </div>
    </div>
    );
  }
