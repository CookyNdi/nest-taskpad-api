import { Module } from '@nestjs/common';

import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
