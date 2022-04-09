import React, { useEffect } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import s from "./StepAvatar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../../store/slices/activateSlice";
import { activateAccount } from "../../../../http";
import { setAuth } from "../../../../store/slices/authSlice";
import Loader from "../../../../components/shared/Loader/Loader";

function StepAvatar({ onNext }) {
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activate);

  const [state, setState] = React.useState({
    value: avatar,
    error: null,
    disabled: true,
    loading: false,
    unmounted: false,
  });

  const setLoading = (ss) => {
    setState({ ...state, loading: ss });
  };

  const setUnmounted = (ss) => {
    setState({ ...state, unmounted: ss });
  };

  const onImageChoose = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setState({
        value: e.target.result,
        error: null,
        disabled: false,
      });
      dispatch(setAvatar(e.target.result));
    };
    reader.readAsDataURL(file);
  };

  const uploadDetails = async () => {
    setState({
      ...state,
      error: null,
      loading: true,
    });
    try {
      const { data } = await activateAccount({
        name,
        avatar,
      });
      if (data.auth && !state.unmounted) {
        dispatch(setAuth(data));
      }
    } catch (e) {
      setState({
        ...state,
        error: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setUnmounted(true);
    };
  }, []);

  if (state.loading)
    return (
      <Loader message={"Please wait! while we activate your account..."} />
    );

  return (
    <>
      <div className={s.cardWrapper}>
        <img
          className={s.backgroundCircleArt}
          src="/images/background-circle.svg"
          alt="bg-asset"
        />
        <Card>
          <h2 className={s.textHeader}>
            Yaaay! {name.split(" ")[1]}, let's choose a dp.
          </h2>

          <div className={s.imageHolder}>
            <img
              src={state.value}
              alt="user profile"
              className={s.circularImageDp}
            ></img>
            <div className={s.avatarInputHolder}>
              <input
                onChange={onImageChoose}
                id="avatarInput"
                type="file"
                className={s.avatarInput}
              />
              <label htmlFor="avatarInput" className={s.avatarInputLabel}>
                Choose a different image.
              </label>
            </div>
          </div>
          <Button
            name={"SAVE"}
            onClick={uploadDetails}
            disabled={state.disabled}
          />
          <p className={s.errorText}>{state.error}</p>
        </Card>
      </div>
    </>
  );
}

export default StepAvatar;
