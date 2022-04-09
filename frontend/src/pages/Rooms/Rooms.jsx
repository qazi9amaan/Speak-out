import React from "react";
import Navigation from "../../components/shared/Navigation/Navigation";
import RoundedButton from "../../components/shared/RoundedButton/RoundedButton";
import RoomCard from "../../components/RoomCard/RoomCard";
import s from "./Rooms.module.css";
import AddRoomModel from "../../components/Models/AddRoomModel/AddRoomModel";
import { getAllRooms } from "../../http";
const categories = [
  { title: "World wide", active: true },
  { title: "Trendings", active: false },
  { title: "Technology", active: false },
  { title: "Well being", active: false },
  { title: "Travel", active: false },
  { title: "Random", active: false },
  { title: "Games", active: false },
  { title: "Finance", active: false },
];

function Rooms() {
  const [roomsState, setroomsState] = React.useState({
    showModel: false,
    rooms: [],
  });

  const { showModel, rooms } = roomsState;

  const toggleModel = () => {
    setroomsState({ ...roomsState, showModel: !showModel });
  };

  const onModelChangeHandler = (e) => {
    toggleModel();
  };

  React.useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getAllRooms();
      setroomsState({ ...roomsState, rooms: data });
    };
    fetchRooms();
  }, []);

  return (
    <>
      <Navigation />
      <section className={s.section}>
        <aside className={s.aside}>
          {categories.map((c, index) => (
            <div
              key={index}
              className={c.active ? s.aside__title_active : s.aside__title}
            >
              <h2>{c.title}</h2>
            </div>
          ))}
        </aside>
        <main className={s.main}>
          <div className={s.header}>
            <p>
              Speak to your other mates while they are waiting for you here.
            </p>
            <RoundedButton
              onClick={onModelChangeHandler}
              name={"Start a room"}
            />
          </div>
          <div className={s.rooms_container}>
            {rooms.map((room, index) => (
              <RoomCard key={index} room={room} />
            ))}
          </div>
        </main>
      </section>
      {showModel && <AddRoomModel onClose={onModelChangeHandler} />}
    </>
  );
}

export default Rooms;
