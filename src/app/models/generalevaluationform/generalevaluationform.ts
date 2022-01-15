import {AppliedSurgery} from './appliedsurgery';
import {OrthesisInfo} from './orthesisinfo';
import {OtherOrthesisInfo} from './otherorthesisinfo';
import {UsedMedicine} from './usedmedicine';
import {CoexistingDiseases} from './coexistingdisease';
import {ExpectationsAboutProgram} from './expectationsaboutprogram';
import {DiseaseOfMotherPregnancy} from "./diseaseofmotherpregnancy";
import {Hyperbilirubinemia} from "./hyperbilirubinemia";
import {AfterBirthReasonCerebralPalsy} from "./afterbirthreasoncerebralpalsy";
import {BotoxTreatment} from "./botoxtreatment";
import {VisualImpairment} from "./visualimpairment";
import {HearingImpairment} from "./hearingimpairment";
import {Epilepsy} from "./epilepsy";
import {PhysiotherapyPast} from "./physiotherapypast";

export class GeneralEvaluationForm {

  // 1. Demografik Bilgiler
  gender: string;
  birthDate: any;
  ageAsMonth: number;
  numberOfSiblings: number;
  whichChild: number;

  // 2. Fiziksel Özellikler
  heightCm: number;
  weightGr: number;
  headRoundCm: number;

  // 3. Dogum Oncesi Ozellikler
  mothersGivenBirthAgeYear: number;
  mothersEducationLevel: string;
  typeOfPregnancy: string;
  fathersEducationLevel: string;
  multiplePregnancy: number;
  isRelativeMarriage: boolean;
  isBloodIncompatibility: boolean;

  // 4. Dogum Ozellikler
  birthWeek: number;
  birthType: string;
  birthWeight: number;
  birthHeadAroundCm: number;
  apgarScore: number;
  isBirthAnoxia: boolean;
  isBirthEmpurpling: boolean;
  isBirthCrying: boolean;
  isHighBloodPressorPregnancy: boolean;
  pregnancyInfectionInfo: string;
  pregnancyMedicineUsageInfo: string;
  isPregnancyDrinking: boolean;
  isPregnanycSmoking: boolean;
  id: number;

  // 5.Doğum Sonrası Özellikler
  oxygenSupport: boolean;
  intensiveCare: number;
  isNewbornRetinopathy: boolean;
  isRespiratuvarDistressSyndrom: boolean
  isBronchopulmonaryDysplasia: boolean;
  isHypoglycaemia: boolean

  //DiseaseOfMotherPregnancy
  diseaseOfMotherPregnancy: DiseaseOfMotherPregnancy;

  //Hyperbilirubinemia
  hyperbilirubinemia: Hyperbilirubinemia;

  //AfterBirthReasonCerebralPalsy
  afterBirthReasonCerebralPalsy: AfterBirthReasonCerebralPalsy;

  //Botox_Treatment
  botoxTreatment: BotoxTreatment;

  /*
    Many to Many ve.þ Many-To-Onelar buraya geecek
  */
  appliedSurgeryCollection: AppliedSurgery[];

  //One to many
  orthesisInfoCollection: OrthesisInfo[];
  otherOrthesisInfoCollection: OtherOrthesisInfo[];
  usedMedicineCollection: UsedMedicine[];

  //ManyToMany
  coexistingDiseasesCollection: CoexistingDiseases[];

  //VisualImpairement
  visualimpairment: VisualImpairment;

  //OneTomany

  //HearingImpairment
  hearingImpairment: HearingImpairment;

  //ExpectationsAboutProgram
  expectationsAboutProgramCollection: ExpectationsAboutProgram[];

  //Epilepsy
  epilepsy: Epilepsy

  //Physioterapy Past
  physiotherapyPast: PhysiotherapyPast
}
