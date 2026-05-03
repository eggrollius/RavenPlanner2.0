DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'meeting_type'
    ) THEN
        CREATE TYPE meeting_type AS ENUM ('lecture', 'tutorial', 'laboratory');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS Course(
    Id int PRIMARY KEY,
    FacultyCode char(4) NOT NULL,
    CourseCode char(4) NOT NULL,
    CourseName varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS CourseOffering(
    Id int PRIMARY KEY,
    CourseId int,
    CONSTRAINT fk_Course
        FOREIGN KEY (CourseId)
        REFERENCES Course(Id)
);

CREATE TABLE IF NOT EXISTS Meeting(
    crn int PRIMARY KEY,
    CourseOfferingId int,
    CONSTRAINT fk_CourseOffering
        FOREIGN KEY (CourseOfferingId)
        REFERENCES CourseOffering(Id),
    MeetingType meeting_type,
    DaysOfWeekMask smallint,
    StartTimeMinutes smallint,
    EndTimeMinutes smallint
);