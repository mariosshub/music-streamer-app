import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type VoteDocument = HydratedDocument<Vote>;

@Schema()
export class Vote {
    @Prop({
        type: Types.ObjectId,
        ref:"Song",
        required: true
    })
    songId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref:"User",
        required: true
    })
    voterId: Types.ObjectId;;
}

export const VotesSchema = SchemaFactory.createForClass(Vote).index({songId: 1, voterId: 1}, {unique: true}); 