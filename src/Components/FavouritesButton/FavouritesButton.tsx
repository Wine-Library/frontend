import {useAuth} from "@/context";
import favourites from "@/assets/icons/Favourites (Heart Like).svg";
import favouritesActive from "@/assets/icons/ActiveFav.svg";
import {useFavourites} from "@/context/FavouritesContext";
import type {Wine} from "@/types";
import s from '../Wines/Wines.module.scss';
import React from "react";
import clsx from "clsx";

type Props = {
    wine: Wine;
    setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FavouritesButton: React.FC<Props> = React.memo(({wine, setShowAuthModal}) => {
    const {favouritesItems, addItemFavourites, removeItemFavourites} = useFavourites();
    const {user} = useAuth();
    const favourited = favouritesItems.some((item) => item.id === wine.id);

    return (
        <button
            onClick={() => {
                if (!user) {
                    setShowAuthModal(true);
                    return;
                }
                if (favourited) {
                    removeItemFavourites(wine.id).catch(console.error);
                } else {
                    addItemFavourites(wine.id).catch(console.error);
                }
            }}
            className={clsx(s.winesButtonsFavourites, favourited && s.winesButtonsFavouritesActive)}
        >
            <img
                src={favourited ? favouritesActive : favourites}
                alt={favourited ? "Remove from favourites" : "Add to favourites"}
                className={s.winesButtonsFavouritesIcon}
            />
        </button>
    )
})