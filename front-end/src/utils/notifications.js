export const formatNotification = (item) => {

    switch(item.type){

        case "USER_FOLLOWED":
            return `${item.username} followed you!`;
        case "POST_CREATED":
            return `${item.username} posted something new!`;
        default:
            return "";
    }
}