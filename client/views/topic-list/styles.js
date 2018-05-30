export const topicPrimaryStyle = (theme) => {//eslint-disable-line
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      textDecoration: 'none',
      color: '#555',
    },
    tab: {
      backgroundColor: theme.palette.primary[500],
      textAlign: 'center',
      display: 'inline-block',
      padding: '0 6px',
      color: '#fff',
      borderRadius: 3,
      marginRight: 10,
      fontSize: '12px',
      flexShrink: 0,
    },
    good: {
      backgroundColor: theme.palette.primary[600],
    },
    top: {
      backgroundColor: theme.palette.primary[200],
    },
  }
}

export const topicSecondaryStyle = (theme) => {//eslint-disable-line
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 3,
      flexWrap: 'wrap',
    },
    count: {
      textAlign: 'center',
      marginRight: 20,
    },
    userName: {
      marginRight: 20,
      color: '#9e9e9e',
    },
    accentColor: {
      color: theme.palette.primary[500],
    },
  }
}

export const topicListStyle = () => {//eslint-disable-line
  return {
    root: {
      margin: 24,
      marginTop: 80,
    },
    loading: {
      display: 'flex',
      justifyContent: 'space-around',
    },
  }
}
