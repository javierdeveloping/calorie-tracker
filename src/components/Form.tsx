import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from "react";
import { categories } from "../data/db";
import { Activity } from "../types";
import {
  ActivityActions,
  ActivityNames,
  ActivityState,
} from "../reducers/activity-reducer";
import { v4 as uuidv4 } from "uuid";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState;
};

const emptyFormActivity = {
  id: uuidv4(),
  category: 2,
  name: "",
  calories: 0,
};

export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>(emptyFormActivity);

  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.filter(
        (stateActivity) => stateActivity.id === state.activeId
      )[0];

      setActivity(selectedActivity);
    }
  }, [state.activeId]);

  function handleChange(
    event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) {
    console.log(event.target);
    const isNumberField = ["category", "calories"].includes(event.target.id);
    console.log({ isNumberField });
    setActivity((prevActivity) => ({
      ...prevActivity,
      [event.target.id]: isNumberField
        ? +event.target.value
        : event.target.value,
    }));
  }

  function isValidActivity() {
    const { name, calories } = activity;

    return name.trim() !== "" && calories > 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    dispatch({
      type: ActivityNames.SAVE_ACTIVITY,
      payload: { newActivity: activity },
    });

    //resetear form
    setActivity({ ...emptyFormActivity, id: uuidv4() });
  }

  return (
    <form
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={(event) => handleSubmit(event)}
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category" className="font-bold">
          Categoria:
        </label>
        <select
          id="category"
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          value={activity.category}
          onChange={(event) => handleChange(event)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">
          Actividad:
        </label>
        <input
          id="name"
          type="text"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej. comida, pesas, jugo de naranja, manzana"
          value={activity.name}
          onChange={(event) => {
            handleChange(event);
          }}
        ></input>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">
          Caloriass:
        </label>
        <input
          id="calories"
          type="text"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej. 300 o 500"
          value={activity.calories}
          onChange={(event) => {
            handleChange(event);
          }}
        ></input>
      </div>

      <input
        type="submit"
        disabled={!isValidActivity()}
        className="disabled:opacity-20 bg-gray-800 hover:bg-gray-900 w-full p-2 bold uppercase text-white cursor-pointer"
        value={activity.category === 1 ? "Guardar comida" : "Guardar ejercicio"}
      ></input>
    </form>
  );
}
