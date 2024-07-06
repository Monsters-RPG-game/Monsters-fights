import mongoose from 'mongoose';
import * as enums from '../../enums';
import type { ISkills } from './types';

const singleSkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name not provided'],
  },
  power: {
    type: Number,
    required: [true, 'power not provided'],
  },
  type: {
    type: String,
    enum: enums.ESkillsType,
    required: [true, 'type not provided'],
    default: enums.ESkillsType.Attack,
  },
  target: {
    type: String,
    enum: enums.ESkillTarget,
    required: [true, 'target not provided'],
    default: enums.ESkillTarget.Enemy,
  },
});

const skillsSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: [true, 'userId not provided'],
    },
    singleSkills: {
      type: [singleSkillSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Skills = mongoose.model<ISkills>('Skills', skillsSchema, enums.EDbCollections.Skills);
export default Skills;
