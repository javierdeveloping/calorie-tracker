import { Activity } from "../types";

export enum ActivityNames {
  SAVE_ACTIVITY = "save-activity",
  EDIT_ACTIVITY = "edit-activity",
  DELETE_ACTIVITY = "delete-activity",
  RESTART_APP = "restart-app",
}

function initialActivities(): Activity[] {
  const localStorageContent = localStorage.getItem("activities");
  const localStorageActivities = localStorageContent
    ? JSON.parse(localStorageContent)
    : [];
  return localStorageActivities;
}
export type ActivityActions =
  | {
      type: ActivityNames.SAVE_ACTIVITY;
      payload: { newActivity: Activity };
    }
  | {
      type: ActivityNames.EDIT_ACTIVITY;
      payload: { id: Activity["id"] };
    }
  | {
      type: ActivityNames.DELETE_ACTIVITY;
      payload: { id: Activity["id"] };
    }
  | {
      type: ActivityNames.RESTART_APP;
    };

export type ActivityState = {
  activities: Activity[];
  activeId: Activity["id"];
};

export const initialState: ActivityState = {
  activities: initialActivities(),
  activeId: "",
};

export function activityReducer(
  state: ActivityState = initialState,
  action: ActivityActions
) {
  if (action.type === ActivityNames.SAVE_ACTIVITY) {
    //code to update state
    console.log("desde el type de save-activity");
    console.log(action.payload);
    let updatedActivities: Activity[] = [];

    if (state.activeId) {
      updatedActivities = state.activities.map((activity) =>
        activity.id === state.activeId ? action.payload.newActivity : activity
      );
    } else {
      updatedActivities = [...state.activities, action.payload.newActivity];
    }
    return {
      ...state, //por si tuvieramos auth u otra cosa
      activities: updatedActivities,
      activeId: "",
    };
  }

  if (action.type == ActivityNames.EDIT_ACTIVITY) {
    return {
      ...state,
      activeId: action.payload.id,
    };
  }

  if (action.type == ActivityNames.DELETE_ACTIVITY) {
    return {
      ...state,
      activities: state.activities.filter(
        (activity) => activity.id !== action.payload.id
      ),
      activeId: "",
    };
  }

  if (action.type == ActivityNames.RESTART_APP) {
    return {
      ...state,
      activities: [],
      activeId: "",
    };
  }

  return state;
}
