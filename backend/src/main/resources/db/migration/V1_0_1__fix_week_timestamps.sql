ALTER TABLE week
    ALTER COLUMN start_date TYPE TIMESTAMP WITH TIME ZONE
        USING start_date AT TIME ZONE 'Africa/Cairo';

ALTER TABLE week
    ALTER COLUMN end_date TYPE TIMESTAMP WITH TIME ZONE
        USING end_date AT TIME ZONE 'Africa/Cairo';