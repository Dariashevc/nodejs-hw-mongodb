export const parseContactFilterParams = ({ type, isFavourite }) => {
    const filters = {};

    if (type) {
        filters.contactType = type;
    }

    if (isFavourite) {
        filters.isFavourite = isFavourite === 'true'; 
    }

    return filters;
};