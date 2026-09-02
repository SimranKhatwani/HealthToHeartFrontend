import { Card, CardContent, CardHeader, CardTitle } from "../../components/UI/Card";
import { Badge } from "../../components/UI/Badge";
import { Button } from "../../components/UI/Button";
import { Progress } from "../../components/UI/Progress";
import { useTranslation } from 'react-i18next';

function RoomStatusCard({ operation, setIsDialogOpen }) {
  const { t } = useTranslation();
  const getStatusColor = () => {
    switch (operation.status) {
      case "in-use":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cleaning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{operation.operationRoom}</CardTitle>
          <Badge className={getStatusColor()}>
            <span className="capitalize">{operation.status.replace("-", " ")}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-sm font-medium">{operation.operationType}</p>
          <p className="text-xs text-muted-foreground">Patient: {operation.patient_details.name}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{t('translation:progress')}</span>
            <span>Time Remaining: {operation.timeRemaining}</span>
          </div>
          <Progress value={operation.progress || 50} className="h-2" />
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">{t('translation:addOperation')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default RoomStatusCard;
