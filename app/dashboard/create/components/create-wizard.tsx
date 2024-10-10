'use client';

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { ClubSelectCombobox } from './club-select-combobox';
import { Club } from '../page';
import { WhereToPost } from './where-to-post';
import { TypeOfPost } from './type-of-post';
import { OpponentSelectCombobox } from './opponent-select-combobox';
import { TimeInput } from './time-input';
import { LocationSelect } from './location-select';
import { ScoreInput } from './score-input';
import { BackButton } from './back-button';
import Typography from '@/components/ui/typography';
import { LoadingScreen } from './loading-screen';

export default function CreateWizard({ clubs }: { clubs: Club[] }) {
    const [params] = useQueryStates({
        club: parseAsInteger,
        where: parseAsString,
        type: parseAsString,
        opponent: parseAsInteger,
        time: parseAsInteger,
        location: parseAsString,
        score: parseAsString,
    });

    const { club, where, type, opponent, time, location, score } = params;
    const isCompleted = club && where && type && opponent && time && location && score;

    return (
        <div className="flex flex-col gap-2">
            <Typography variant="h1">{isCompleted ? 'Generating post...' : 'Create a new post'}</Typography>
            {!club && (
                <div className="flex flex-col gap-2">
                    <ClubSelectCombobox clubs={clubs} />
                </div>
            )}
            {club && !where && <WhereToPost />}
            {club && where && !type && <TypeOfPost />}
            {club && where && type && !opponent && <OpponentSelectCombobox clubs={clubs} />}
            {club && where && type && opponent && !time && <TimeInput />}
            {club && where && type && opponent && time && !location && <LocationSelect />}
            {club && where && type && opponent && time && location && !score && <ScoreInput />}
            {isCompleted ? <LoadingScreen /> : <BackButton />}
        </div>
    );
}
