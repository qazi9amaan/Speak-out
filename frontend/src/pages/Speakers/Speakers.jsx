import React from "react";
import Room from "../../components/Room/Room";
import Button from "../../components/shared/Button/Button";
import Card from "../../components/shared/Card/Card";
import Navigation from "../../components/shared/Navigation/Navigation";
import s from "./Speakers.module.css";
function Speakers() {
  return (
    <>
      <Navigation />
      <main>
        <section className={s.hero}>
          {/* left side */}
          <div className={s.herotext}>
            <header>
              <h3 className={s.textHeaderLight}>
                Start listening to what's going onn!
              </h3>
              <p className={s.textSubheaderLight}>
                Speak to your other mates while they are waiting for you here.
              </p>
            </header>

            <div className={s.RoomsHoler}>
              {new Array(10).fill(0).map((_, i) => (
                <Room
                  name={"Life is here"}
                  image="http://localhost:5000/storage/1646592270056-857320430.png"
                />
              ))}
            </div>
          </div>
          {/* new room anim */}
          <div className={s.cardWrapper}>
            <img
              alt=""
              className={s.backgroundCircleArt}
              src="/images/background-circle.svg"
            />
            <Card>
              <h2 className={s.textHeader}>Please provide your phone number</h2>
              <p className={s.textSubheader}>
                We’ll text you a 4 digit verfication code.
              </p>

              <Button name={"CONTINUE"} disabled={false} />
            </Card>
          </div>
        </section>
        <section style={{ marginTop: "2em" }}>
          {/* heading */}
          <p className={s.textSubheaderLight}>
            Speak to your other mates while they are waiting for you here.
          </p>
          {/* room list */}
          <div className={s.RoomsHoler}>
            {new Array(50).fill(0).map((_, i) => (
              <Room
                name={"Life is here"}
                image="http://localhost:5000/storage/1646592270056-857320430.png"
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Speakers;
