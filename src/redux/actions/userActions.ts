export const setUserEmail = (email :string) => {
    return {
      type: 'SET_USER_EMAIL',
      payload: email,
    };
  };