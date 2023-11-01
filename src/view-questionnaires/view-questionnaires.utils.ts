import { FilterQuery } from 'mongoose';
import { Questionnaire } from 'src/upload-questionnaire/questionnaire.schema';

export const questionnaireSearchFilterQuery = (
  search?: string,
): FilterQuery<Questionnaire> => {
  return search
    ? {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { technologies: { $regex: search, $options: 'i' } },
          { level: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
};
